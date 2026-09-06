import { TaskQueries } from "../../../database/queries/task.js";
import type { IRequest } from "../../../helpers/api.js";
import type { UpdateTaskRequest } from "./updateTaskRequest.js";

import { ProjectQueries } from "../../../database/queries/project.js";
import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { Permissions } from "../../../helpers/permissions.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent } from "../../../realtime/events.js";
import { createNotification } from "../../../services/notification/notificationService.js";
import {
    taskContext,
    validateWorkShape,
    resolvedStatus,
    nextRecurringDate,
    validateTaskRelations,
    introducesDependencyCycle,
    introducesParentCycle,
    requestSocketId,
} from "../../../services/task/taskService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { TaskErrorResponses } from "../../../responses/errors/TaskErrorResponses.js";

export async function updateTaskHandler(
    request: IRequest<UpdateTaskRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const current = await TaskQueries.getTaskByIdQuery(value.id);
        const requiredPermission =
            current?.users?.createdBy === request.userId! ? Permissions.EDIT_OWN : Permissions.EDIT_OTHER;
        const context = current
            ? await taskContext(request.userId!, current.projectId, [requiredPermission])
            : undefined;
        if (!current || !context) {
            response.status(403).json({ ...TaskErrorResponses.PROJECT_TASK_ACCESS_DENIED });
            return;
        }
        const { id: _id, version, assigneeIds, reviewerId, ...updates } = value;
        const memberIds = new Set([...context.community.ownerIds, ...context.community.userIds].map(String));
        if (
            assigneeIds?.some((candidate: string) => !memberIds.has(candidate)) ||
            (reviewerId && !memberIds.has(reviewerId))
        ) {
            response.status(400).json({ ...TaskErrorResponses.TASK_USERS_MUST_BELONG_TO_THE_COMMUNITY });
            return;
        }
        const previousAssignees = new Set(current.users?.userIds ?? []);
        const shapeError = await validateWorkShape(current.projectId, context.community.id, value, current);
        if (shapeError) {
            response.status(400).json({ code: 400, message: shapeError });
            return;
        }
        if (
            !(await validateTaskRelations(current.projectId, current.id, [
                value.parentId,
                ...(value.dependencyIds ?? []),
                ...(value.relatedTaskIds ?? []),
            ]))
        ) {
            response.status(400).json({
                ...TaskErrorResponses.TASK_RELATIONSHIPS_MUST_REFERENCE_OTHER_TASKS_IN_THE_SAME_PROJECT,
            });
            return;
        }
        if (
            value.dependencyIds &&
            (await introducesDependencyCycle(current.projectId, current.id, value.dependencyIds))
        ) {
            response.status(400).json({ ...TaskErrorResponses.TASK_DEPENDENCIES_CANNOT_FORM_A_CYCLE });
            return;
        }
        if (
            value.parentId !== undefined &&
            (await introducesParentCycle(current.projectId, current.id, value.parentId))
        ) {
            response.status(400).json({ ...TaskErrorResponses.TASK_HIERARCHY_CANNOT_FORM_A_CYCLE });
            return;
        }
        const targetState = await resolvedStatus(
            current.projectId,
            context.community.id,
            value.typeKey ?? current.typeKey,
            value.status ?? current.status,
        );
        const generateNextOccurrence = Boolean(
            targetState.done && !current.accomplished && current.recurrence && !current.recurrenceGeneratedAt,
        );
        const task = await runInTransaction(async () => {
            const updated = await TaskQueries.updateTaskQuery(
                { _id: value.id, version },
                {
                    $set: {
                        ...updates,
                        ...(updates.deadline
                            ? {
                                  deadlineAt:
                                      updates.deadline === "Unlimited" ? null : new Date(updates.deadline),
                              }
                            : {}),
                        ...(updates.status ? { accomplished: targetState.done } : {}),
                        ...(generateNextOccurrence ? { recurrenceGeneratedAt: new Date() } : {}),
                        ...(assigneeIds ? { "users.userIds": assigneeIds } : {}),
                        ...(reviewerId ? { "users.reviewer": reviewerId } : {}),
                    },
                    $inc: { version: 1 },
                },
                { new: true, session: getTransactionSession() },
            );
            if (!updated) return null;
            const eventName =
                updates.status || updates.position !== undefined ? "task-moved-v1" : "task-updated-v1";
            await enqueueRealtimeEvent({
                channels: [
                    RealtimeChannels.project(updated.projectId),
                    ...Array.from(new Set([...previousAssignees, ...(updated.users?.userIds ?? [])]))
                        .slice(0, 99)
                        .map(RealtimeChannels.user),
                ],
                eventName,
                actorId: request.userId!,
                aggregate: { type: "task", id: updated.id, version: updated.version },
                data: {
                    task: updated.toObject({ virtuals: true }),
                    changedFields: Object.keys(request.body),
                },
                socketId: requestSocketId(request.header("x-pusher-socket-id")),
            });
            for (const recipientId of (assigneeIds ?? []).filter(
                (candidate: string) => candidate !== request.userId! && !previousAssignees.has(candidate),
            )) {
                await createNotification({
                    recipientId,
                    actorId: request.userId!,
                    communityId: context.community.id,
                    projectId: updated.projectId,
                    resourceType: "task",
                    resourceId: updated.id,
                    type: "task-assigned",
                    title: "Task assigned",
                    body: `You were assigned to ${updated.title}.`,
                });
            }
            if (generateNextOccurrence && current.recurrence) {
                const basis = current.deadlineAt ?? current.startAt ?? new Date();
                const nextBasis = nextRecurringDate(basis, current.recurrence);
                if (!current.recurrence.until || nextBasis <= current.recurrence.until) {
                    const startAt = current.startAt
                        ? new Date(current.startAt.getTime() + (nextBasis.getTime() - basis.getTime()))
                        : undefined;
                    const nextTask = await TaskQueries.createTaskQuery({
                        projectId: current.projectId,
                        title: current.title,
                        description: current.description,
                        priority: current.priority,
                        deadline: current.deadlineAt ? nextBasis.toISOString() : "Unlimited",
                        deadlineAt: current.deadlineAt ? nextBasis : undefined,
                        startAt,
                        status: (
                            await resolvedStatus(current.projectId, context.community.id, current.typeKey)
                        ).status,
                        position: current.position,
                        accomplished: false,
                        users: current.users,
                        typeKey: current.typeKey,
                        customFields: current.customFields,
                        parentId: current.parentId,
                        dependencyIds: [],
                        relatedTaskIds: current.relatedTaskIds,
                        tags: current.tags,
                        estimatedMinutes: current.estimatedMinutes,
                        milestone: current.milestone,
                        recurrence: current.recurrence,
                        audience: current.audience,
                    });
                    await ProjectQueries.addTaskToProjectQuery(current.projectId, nextTask.id);
                    await enqueueRealtimeEvent({
                        channels: [
                            RealtimeChannels.project(current.projectId),
                            ...(nextTask.users?.userIds ?? []).slice(0, 99).map(RealtimeChannels.user),
                        ],
                        eventName: "task-created-v1",
                        actorId: request.userId!,
                        aggregate: { type: "task", id: nextTask.id, version: nextTask.version },
                        data: { task: nextTask.toObject({ virtuals: true }), recurrenceSourceId: current.id },
                    });
                }
            }
            return updated;
        });
        if (!task) {
            response.status(409).json({ ...TaskErrorResponses.TASK_CHANGED_ELSEWHERE_RELOAD_AND_RETRY });
            return;
        }
        request.responseModel = task;
        next();
    } catch (error) {
        next(error);
    }
}
