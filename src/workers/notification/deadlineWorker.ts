import { ProjectQueries } from "../../database/queries/project.js";
import { TaskQueries } from "../../database/queries/task.js";
import { createNotification } from "../../services/notification/notificationService.js";

export async function publishUpcomingDeadlineNotifications(): Promise<number> {
    const now = new Date();
    const horizon = new Date(now.getTime() + 24 * 60 * 60_000);
    const tasks = await TaskQueries.getTasksQuery({
        _seed: { $exists: false },
        accomplished: false,
        deadlineAt: { $gte: now, $lte: horizon },
    }).limit(500);
    const projects = await ProjectQueries.getProjectsByIdsQuery(
        Array.from(new Set(tasks.map((task) => task.projectId))),
    ).lean();
    const communityByProject = new Map(projects.map((project) => [String(project._id), project.communityId]));
    let created = 0;
    for (const task of tasks) {
        for (const recipientId of task.users?.userIds ?? []) {
            try {
                await createNotification({
                    recipientId,
                    communityId: communityByProject.get(task.projectId),
                    projectId: task.projectId,
                    resourceType: "task",
                    resourceId: task.id,
                    type: "task-due-soon",
                    title: "Task due soon",
                    body: `${task.title} is due within 24 hours.`,
                    dedupeKey: `task-due:${task.id}:${recipientId}:${task.deadline}`,
                });
                created += 1;
            } catch (error) {
                if ((error as { code?: number }).code !== 11000) throw error;
            }
        }
    }
    return created;
}
