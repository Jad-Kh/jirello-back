import bcrypt from "bcrypt";
import { CalendarModel } from "../../database/models/calendar/Calendar.js";
import { CalendarEventModel } from "../../database/models/calendar/CalendarEvent.js";
import { CollaborationMessageModel } from "../../database/models/collaboration/CollaborationMessage.js";
import { CommunityModel } from "../../database/models/community/Community.js";
import { ProjectFinanceModel } from "../../database/models/finance/ProjectFinance.js";
import { NotificationModel } from "../../database/models/notification/Notification.js";
import { ClientPortalModel } from "../../database/models/portal/ClientPortal.js";
import { DeliverableModel } from "../../database/models/portal/Deliverable.js";
import { PortalCommentModel } from "../../database/models/portal/PortalComment.js";
import { ProjectModel } from "../../database/models/project/Project.js";
import { RoleModel } from "../../database/models/role/Role.js";
import { TaskModel } from "../../database/models/task/Task.js";
import { MemberCapacityModel } from "../../database/models/time/MemberCapacity.js";
import { TimeEntryModel } from "../../database/models/time/TimeEntry.js";
import { UserModel } from "../../database/models/user/User.js";
import { SavedWorkViewModel } from "../../database/models/work/SavedWorkView.js";
import { WorkConfigurationModel } from "../../database/models/work/WorkConfiguration.js";
import { WorkTemplateModel } from "../../database/models/work/WorkTemplate.js";
import type { ScaleSeedOptions } from "./config.js";
import { profileTotals } from "./config.js";
import { createIdentityFactory } from "./identities.js";
import { createRandom } from "./random.js";
import { writeGenerated } from "./writer.js";

const firstNames = [
    "Alex",
    "Maya",
    "Noah",
    "Lina",
    "Omar",
    "Sofia",
    "Elias",
    "Nora",
    "Sam",
    "Yara",
    "Theo",
    "Mira",
] as const;
const lastNames = [
    "Morgan",
    "Chen",
    "Rivera",
    "Haddad",
    "Ibrahim",
    "Kovacs",
    "Silva",
    "Kim",
    "Patel",
    "Martin",
] as const;
const projectThemes = [
    "Customer Onboarding",
    "Mobile Experience",
    "Platform Reliability",
    "Billing Modernization",
    "Growth Experiments",
    "Enterprise Launch",
    "Analytics Workspace",
    "Design System",
    "Security Review",
    "Developer Experience",
] as const;
const taskActions = [
    "Design",
    "Implement",
    "Review",
    "Validate",
    "Document",
    "Measure",
    "Refactor",
    "Launch",
] as const;
const taskSubjects = [
    "onboarding flow",
    "permission model",
    "billing experience",
    "realtime recovery",
    "calendar workflow",
    "client portal",
    "reporting dashboard",
    "search experience",
    "notification policy",
    "deployment pipeline",
] as const;
const messageBodies = [
    "I shared the latest draft. Please focus on the open decision and edge cases.",
    "The implementation is ready for review; the remaining risk is documented.",
    "Customer feedback supports this direction, but we should validate the empty state.",
    "I reproduced the issue and added concrete steps to the task.",
    "The rollout metric is stable. We can continue with the next cohort.",
    "Can someone verify this against the acceptance criteria before tomorrow?",
] as const;

const allPermissions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const permissions = {
    tasks: allPermissions,
    taskGroups: allPermissions,
    meetings: allPermissions,
    projects: allPermissions,
    screens: allPermissions,
    roles: allPermissions,
    users: allPermissions,
    communities: allPermissions,
};

function addDays(anchor: Date, days: number, hour = 10) {
    const value = new Date(anchor);
    value.setUTCDate(value.getUTCDate() + days);
    value.setUTCHours(hour, 0, 0, 0);
    return value;
}

function timestamp(anchor: Date, index: number, spreadDays = 730) {
    const daysAgo = index % spreadDays;
    return addDays(anchor, -daysAgo, 8 + (index % 10));
}

export const scaleSeedCollections = [
    PortalCommentModel.collection,
    DeliverableModel.collection,
    ClientPortalModel.collection,
    ProjectFinanceModel.collection,
    CalendarEventModel.collection,
    CalendarModel.collection,
    TimeEntryModel.collection,
    MemberCapacityModel.collection,
    NotificationModel.collection,
    CollaborationMessageModel.collection,
    SavedWorkViewModel.collection,
    WorkTemplateModel.collection,
    WorkConfigurationModel.collection,
    TaskModel.collection,
    ProjectModel.collection,
    RoleModel.collection,
    CommunityModel.collection,
    UserModel.collection,
];

export async function generateScaleData(
    options: ScaleSeedOptions,
    onProgress: (domain: string, count: number) => void,
) {
    const { profile, batchSize, anchor, runId, profileName, seed } = options;
    const totals = profileTotals(profile);
    const id = createIdentityFactory(runId);
    const random = createRandom(seed);
    const marker = { runId, profile: profileName };
    const password = process.env.SCALE_SEED_PASSWORD ?? "JirelloScale123!";
    const passwordHash = await bcrypt.hash(password, 10);
    const roleCount = profile.communities * 4;

    const communityId = (index: number) => id("community", index);
    const roleId = (communityIndex: number, roleIndex: number) => id("role", communityIndex * 4 + roleIndex);
    const userId = (index: number) => id("user", index);
    const projectId = (index: number) => id("project", index);
    const taskId = (projectIndex: number, taskIndex: number) =>
        id("task", projectIndex * profile.tasksPerProject + taskIndex);

    await writeGenerated(UserModel.collection, totals.users, batchSize, marker, (index) => {
        const communityIndex = Math.floor(index / profile.usersPerCommunity);
        const localUserIndex = index % profile.usersPerCommunity;
        const assignedRole = localUserIndex === 0 ? 0 : 1 + (localUserIndex % 3);
        const createdAt = timestamp(anchor, index, 1_800);
        const firstName = firstNames[index % firstNames.length]!;
        const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length]!;
        const username = `scale_${profileName}_${options.seed}_${index}`
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "_");
        return {
            _id: userId(index),
            profile: {
                username,
                firstName,
                lastName,
                birthday: `${1980 + (index % 20)}-${String(1 + (index % 12)).padStart(2, "0")}-15`,
                email: `${username}@scale.jirello.dev`,
                password: passwordHash,
            },
            isAdmin: localUserIndex === 0,
            communityIds: [communityId(communityIndex).toString()],
            ownedCommunityIds: localUserIndex === 0 ? [communityId(communityIndex).toString()] : [],
            tasks: {},
            notifications: {},
            roles: {
                priorityRoleId: roleId(communityIndex, assignedRole).toString(),
                roleIds: [roleId(communityIndex, assignedRole).toString()],
            },
            permittedScreenIds: [],
            access: {},
            createdAt,
            updatedAt: createdAt,
        };
    });
    onProgress("users", totals.users);

    await writeGenerated(RoleModel.collection, roleCount, batchSize, marker, (index) => {
        const communityIndex = Math.floor(index / 4);
        const localRoleIndex = index % 4;
        const titles = ["Workspace Owner", "Project Manager", "Contributor", "Client Reviewer"];
        const users: string[] = [];
        for (let localUser = 0; localUser < profile.usersPerCommunity; localUser += 1) {
            const assignedRole = localUser === 0 ? 0 : 1 + (localUser % 3);
            if (assignedRole === localRoleIndex) {
                users.push(userId(communityIndex * profile.usersPerCommunity + localUser).toString());
            }
        }
        return {
            _id: id("role", index),
            title: titles[localRoleIndex],
            userIds: users,
            communityId: communityId(communityIndex).toString(),
            permissionOverrides: permissions,
            permittedScreenIds: [],
            overrideAll: localRoleIndex === 0,
            priorityPosition: localRoleIndex,
            projectBased: localRoleIndex > 0,
            projectIds: [],
            createdAt: anchor,
            updatedAt: anchor,
        };
    });
    onProgress("roles", roleCount);

    await writeGenerated(CommunityModel.collection, totals.communities, batchSize, marker, (index) => {
        const userStart = index * profile.usersPerCommunity;
        const projectStart = index * profile.projectsPerCommunity;
        return {
            _id: communityId(index),
            name: `Scale Workspace ${profileName} ${options.seed} ${index + 1}`,
            flag: `${profileName[0]}S${String(index + 1).padStart(3, "0")}${options.seed.slice(-3)}`.toUpperCase(),
            ownerIds: [userId(userStart).toString()],
            userIds: Array.from({ length: profile.usersPerCommunity }, (_, offset) =>
                userId(userStart + offset).toString(),
            ),
            projectIds: Array.from({ length: profile.projectsPerCommunity }, (_, offset) =>
                projectId(projectStart + offset).toString(),
            ),
            roleIds: Array.from({ length: 4 }, (_, offset) => roleId(index, offset).toString()),
            screenIds: [],
            template: "Product",
            permissions,
            validationLevel: 0,
            requiredValidationLevel: 0,
            createdAt: anchor,
            updatedAt: anchor,
        };
    });
    onProgress("communities", totals.communities);

    await writeGenerated(ProjectModel.collection, totals.projects, batchSize, marker, (index) => {
        const communityIndex = Math.floor(index / profile.projectsPerCommunity);
        const localProjectIndex = index % profile.projectsPerCommunity;
        const userStart = communityIndex * profile.usersPerCommunity;
        const members = Math.min(profile.usersPerCommunity, 24);
        return {
            _id: projectId(index),
            name: `${projectThemes[localProjectIndex % projectThemes.length]} ${localProjectIndex + 1}`,
            communityId: communityId(communityIndex).toString(),
            organizerIds: [userId(userStart + (localProjectIndex % members)).toString()],
            userIds: Array.from({ length: members }, (_, offset) =>
                userId(userStart + ((localProjectIndex * 7 + offset) % profile.usersPerCommunity)).toString(),
            ),
            taskIds: Array.from({ length: profile.tasksPerProject }, (_, offset) =>
                taskId(index, offset).toString(),
            ),
            taskGroupIds: [],
            createdAt: timestamp(anchor, index, 1_200),
            updatedAt: anchor,
        };
    });
    onProgress("projects", totals.projects);

    await writeGenerated(TaskModel.collection, totals.tasks, batchSize, marker, (index) => {
        const projectIndex = Math.floor(index / profile.tasksPerProject);
        const localTaskIndex = index % profile.tasksPerProject;
        const communityIndex = Math.floor(projectIndex / profile.projectsPerCommunity);
        const userStart = communityIndex * profile.usersPerCommunity;
        const status = random.weighted([
            { value: "backlog", weight: 0.2 },
            { value: "todo", weight: 0.25 },
            { value: "in-progress", weight: 0.2 },
            { value: "review", weight: 0.1 },
            { value: "done", weight: 0.25 },
        ]);
        const priority = random.weighted([
            { value: "low", weight: 0.12 },
            { value: "medium", weight: 0.55 },
            { value: "high", weight: 0.25 },
            { value: "urgent", weight: 0.08 },
        ]);
        const deadlineAt = addDays(anchor, random.integer(-120, 180));
        const createdAt = timestamp(anchor, index, 1_000);
        return {
            _id: id("task", index),
            title: `${random.pick(taskActions)} ${random.pick(taskSubjects)} #${localTaskIndex + 1}`,
            description:
                "A realistic delivery item with acceptance criteria, ownership, and measurable outcome.",
            priority,
            deadline: deadlineAt.toISOString(),
            deadlineAt,
            accomplished: status === "done",
            projectId: projectId(projectIndex).toString(),
            status,
            position: localTaskIndex,
            version: 1,
            typeKey: random.chance(0.08) ? "milestone" : "task",
            customFields: { impact: random.pick(["Low", "Medium", "High"]) },
            dependencyIds: [],
            relatedTaskIds: [],
            tags: [random.pick(["frontend", "backend", "research", "operations", "quality"])],
            estimatedMinutes: random.integer(30, 2_400),
            milestone: random.chance(0.08),
            audience: random.chance(0.15) ? "client" : "internal",
            users: {
                createdBy: userId(userStart + (localTaskIndex % profile.usersPerCommunity)).toString(),
                reviewer: userId(userStart).toString(),
                userIds: [
                    userId(userStart + ((localTaskIndex * 3 + 1) % profile.usersPerCommunity)).toString(),
                ],
            },
            createdAt,
            updatedAt: createdAt,
        };
    });
    onProgress("tasks", totals.tasks);

    await writeGenerated(WorkConfigurationModel.collection, totals.projects, batchSize, marker, (index) => {
        const communityIndex = Math.floor(index / profile.projectsPerCommunity);
        return {
            _id: id("work-configuration", index),
            communityId: communityId(communityIndex).toString(),
            projectId: projectId(index).toString(),
            key: "product-workflow",
            name: "Product delivery",
            description: "A production-style workflow for planning and delivery.",
            color: "#7357d9",
            statuses: [
                { key: "backlog", name: "Backlog", category: "todo", position: 0 },
                { key: "todo", name: "To do", category: "todo", position: 1 },
                { key: "in-progress", name: "In progress", category: "in-progress", position: 2 },
                { key: "review", name: "Review", category: "in-progress", position: 3 },
                { key: "done", name: "Done", category: "done", position: 4 },
            ],
            fields: [],
            transitions: [],
            isDefault: true,
            version: 1,
            createdAt: anchor,
            updatedAt: anchor,
        };
    });
    onProgress("work configurations", totals.projects);

    await writeGenerated(WorkTemplateModel.collection, totals.projects, batchSize, marker, (index) => {
        const communityIndex = Math.floor(index / profile.projectsPerCommunity);
        return {
            _id: id("work-template", index),
            communityId: communityId(communityIndex).toString(),
            projectId: projectId(index).toString(),
            name: "Feature delivery",
            description: "Reusable production delivery checklist.",
            createdBy: userId(communityIndex * profile.usersPerCommunity).toString(),
            typeKey: "task",
            defaults: { priority: "medium", tags: ["delivery"] },
            createdAt: anchor,
            updatedAt: anchor,
        };
    });
    onProgress("work templates", totals.projects);

    await writeGenerated(SavedWorkViewModel.collection, totals.projects, batchSize, marker, (index) => {
        const communityIndex = Math.floor(index / profile.projectsPerCommunity);
        return {
            _id: id("saved-work-view", index),
            communityId: communityId(communityIndex).toString(),
            projectId: projectId(index).toString(),
            ownerId: userId(communityIndex * profile.usersPerCommunity).toString(),
            name: `Delivery board ${index + 1}`,
            visibility: "project",
            layout: "board",
            filters: {},
            sort: [{ field: "position", direction: "asc" }],
            groupBy: "status",
            createdAt: anchor,
            updatedAt: anchor,
        };
    });
    onProgress("saved work views", totals.projects);

    await writeGenerated(
        CollaborationMessageModel.collection,
        totals.messages,
        batchSize,
        marker,
        (index) => {
            const projectIndex = Math.floor(index / profile.messagesPerProject);
            const communityIndex = Math.floor(projectIndex / profile.projectsPerCommunity);
            const localIndex = index % profile.messagesPerProject;
            const createdAt = timestamp(anchor, localIndex, 540);
            return {
                _id: id("message", index),
                kind: "chat",
                scopeType: "project",
                scopeId: projectId(projectIndex).toString(),
                communityId: communityId(communityIndex).toString(),
                projectId: projectId(projectIndex).toString(),
                authorId: userId(
                    communityIndex * profile.usersPerCommunity + (localIndex % profile.usersPerCommunity),
                ).toString(),
                body: random.pick(messageBodies),
                mentionedUserIds: random.chance(0.12)
                    ? [userId(communityIndex * profile.usersPerCommunity).toString()]
                    : [],
                version: 1,
                createdAt,
                updatedAt: createdAt,
            };
        },
    );
    onProgress("messages", totals.messages);

    await writeGenerated(NotificationModel.collection, totals.notifications, batchSize, marker, (index) => {
        const userIndex = Math.floor(index / profile.notificationsPerUser);
        const localIndex = index % profile.notificationsPerUser;
        const communityIndex = Math.floor(userIndex / profile.usersPerCommunity);
        const projectIndex =
            communityIndex * profile.projectsPerCommunity + (localIndex % profile.projectsPerCommunity);
        const createdAt = timestamp(anchor, localIndex, 365);
        return {
            _id: id("notification", index),
            recipientId: userId(userIndex).toString(),
            type: random.pick(["assignment", "mention", "deadline", "project-update"]),
            title: random.pick([
                "Task assigned",
                "You were mentioned",
                "Deadline approaching",
                "Project updated",
            ]),
            body: random.pick(messageBodies),
            actorId: userId(
                communityIndex * profile.usersPerCommunity +
                    ((userIndex + localIndex + 1) % profile.usersPerCommunity),
            ).toString(),
            communityId: communityId(communityIndex).toString(),
            projectId: projectId(projectIndex).toString(),
            resourceType: "task",
            resourceId: taskId(projectIndex, localIndex % profile.tasksPerProject).toString(),
            ...(random.chance(0.65) ? { readAt: addDays(createdAt, 1) } : {}),
            createdAt,
            updatedAt: createdAt,
        };
    });
    onProgress("notifications", totals.notifications);

    await writeGenerated(MemberCapacityModel.collection, totals.users, batchSize, marker, (index) => {
        const communityIndex = Math.floor(index / profile.usersPerCommunity);
        return {
            _id: id("capacity", index),
            communityId: communityId(communityIndex).toString(),
            userId: userId(index).toString(),
            timezone: random.pick(["Asia/Beirut", "Europe/London", "America/New_York", "Asia/Singapore"]),
            weeklyMinutes: random.pick([1_800, 2_100, 2_400]),
            workingDays: [1, 2, 3, 4, 5],
            dailyMinutes: random.pick([360, 420, 480]),
            overrides: [],
            createdAt: anchor,
            updatedAt: anchor,
        };
    });
    onProgress("member capacities", totals.users);

    await writeGenerated(TimeEntryModel.collection, totals.timeEntries, batchSize, marker, (index) => {
        const userIndex = Math.floor(index / profile.timeEntriesPerUser);
        const localIndex = index % profile.timeEntriesPerUser;
        const communityIndex = Math.floor(userIndex / profile.usersPerCommunity);
        const projectIndex =
            communityIndex * profile.projectsPerCommunity + (localIndex % profile.projectsPerCommunity);
        const startedAt = timestamp(anchor, localIndex, 365);
        const durationMinutes = random.pick([30, 45, 60, 90, 120, 180, 240]);
        return {
            _id: id("time-entry", index),
            communityId: communityId(communityIndex).toString(),
            projectId: projectId(projectIndex).toString(),
            taskId: taskId(projectIndex, localIndex % profile.tasksPerProject).toString(),
            userId: userId(userIndex).toString(),
            description: `Worked on ${random.pick(taskSubjects)}`,
            startedAt,
            endedAt: new Date(startedAt.getTime() + durationMinutes * 60_000),
            durationMinutes,
            billable: random.chance(0.72),
            billingRateCents: random.pick([9_500, 12_500, 15_000, 18_000]),
            costRateCents: random.pick([4_500, 6_500, 8_000]),
            currency: "USD",
            status: random.weighted([
                { value: "draft", weight: 0.2 },
                { value: "submitted", weight: 0.15 },
                { value: "approved", weight: 0.6 },
                { value: "rejected", weight: 0.05 },
            ]),
            version: 1,
            createdAt: startedAt,
            updatedAt: startedAt,
        };
    });
    onProgress("time entries", totals.timeEntries);

    await writeGenerated(CalendarModel.collection, totals.projects, batchSize, marker, (index) => {
        const communityIndex = Math.floor(index / profile.projectsPerCommunity);
        return {
            _id: id("calendar", index),
            ownerId: userId(communityIndex * profile.usersPerCommunity).toString(),
            communityId: communityId(communityIndex).toString(),
            projectId: projectId(index).toString(),
            name: "Project calendar",
            color: "#7357d9",
            timezone: "UTC",
            visibility: "members",
            isDefault: true,
            version: 1,
            createdAt: anchor,
            updatedAt: anchor,
        };
    });
    onProgress("calendars", totals.projects);

    await writeGenerated(CalendarEventModel.collection, totals.calendarEvents, batchSize, marker, (index) => {
        const projectIndex = Math.floor(index / profile.eventsPerProject);
        const localIndex = index % profile.eventsPerProject;
        const communityIndex = Math.floor(projectIndex / profile.projectsPerCommunity);
        const startAt = addDays(anchor, random.integer(-180, 180), 8 + (localIndex % 9));
        return {
            _id: id("calendar-event", index),
            ownerId: userId(communityIndex * profile.usersPerCommunity).toString(),
            organizerId: userId(communityIndex * profile.usersPerCommunity).toString(),
            calendarId: id("calendar", projectIndex).toString(),
            communityId: communityId(communityIndex).toString(),
            projectId: projectId(projectIndex).toString(),
            kind: random.pick(["event", "meeting", "focus", "deadline"]),
            title: `${random.pick(taskActions)} ${random.pick(taskSubjects)}`,
            description: "A scheduled project event generated for realistic calendar volume.",
            startAt,
            endAt: new Date(startAt.getTime() + random.pick([30, 60, 90, 120]) * 60_000),
            allDay: false,
            timezone: "UTC",
            visibility: "project",
            availability: "busy",
            status: "confirmed",
            attendees: [],
            reminders: [{ minutesBefore: 30, method: "notification" }],
            version: 1,
            createdAt: startAt,
            updatedAt: startAt,
        };
    });
    onProgress("calendar events", totals.calendarEvents);

    await writeGenerated(ProjectFinanceModel.collection, totals.projects, batchSize, marker, (index) => {
        const communityIndex = Math.floor(index / profile.projectsPerCommunity);
        return {
            _id: id("finance", index),
            communityId: communityId(communityIndex).toString(),
            projectId: projectId(index).toString(),
            currency: "USD",
            budgetCents: random.integer(500_000, 25_000_000),
            defaultBillingRateCents: random.pick([12_500, 15_000, 18_000]),
            defaultCostRateCents: random.pick([6_500, 8_000, 9_500]),
            billingModel: random.pick(["hourly", "fixed", "retainer"]),
            memberRates: [],
            visibleToClients: random.chance(0.2),
            createdAt: anchor,
            updatedAt: anchor,
        };
    });
    onProgress("project finances", totals.projects);

    await writeGenerated(ClientPortalModel.collection, totals.projects, batchSize, marker, (index) => {
        const communityIndex = Math.floor(index / profile.projectsPerCommunity);
        return {
            _id: id("client-portal", index),
            communityId: communityId(communityIndex).toString(),
            projectId: projectId(index).toString(),
            enabled: true,
            name: `Client workspace ${index + 1}`,
            welcomeMessage: "Progress, decisions, and deliverables in one shared view.",
            accentColor: "#7357d9",
            showProgress: true,
            showMilestones: true,
            showFinancials: false,
            publicEnabled: index % 5 === 0,
            publicSlug: `${runId}-project-${index + 1}`,
            createdAt: anchor,
            updatedAt: anchor,
        };
    });
    onProgress("client portals", totals.projects);

    await writeGenerated(DeliverableModel.collection, totals.deliverables, batchSize, marker, (index) => {
        const projectIndex = Math.floor(index / profile.deliverablesPerProject);
        const localIndex = index % profile.deliverablesPerProject;
        const communityIndex = Math.floor(projectIndex / profile.projectsPerCommunity);
        const createdAt = timestamp(anchor, localIndex, 180);
        const status = random.pick(["draft", "submitted", "approved", "changes-requested"]);
        return {
            _id: id("deliverable", index),
            communityId: communityId(communityIndex).toString(),
            projectId: projectId(projectIndex).toString(),
            taskId: taskId(projectIndex, localIndex % profile.tasksPerProject).toString(),
            title: `${random.pick(projectThemes)} deliverable ${localIndex + 1}`,
            description: "A client-facing delivery artifact with realistic lifecycle state.",
            createdBy: userId(communityIndex * profile.usersPerCommunity).toString(),
            dueAt: addDays(anchor, random.integer(-60, 120)),
            ...(status !== "draft" ? { submittedAt: createdAt } : {}),
            status,
            version: 1,
            assets: [],
            createdAt,
            updatedAt: createdAt,
        };
    });
    onProgress("deliverables", totals.deliverables);

    await writeGenerated(PortalCommentModel.collection, totals.portalComments, batchSize, marker, (index) => {
        const projectIndex = Math.floor(index / profile.commentsPerProject);
        const localIndex = index % profile.commentsPerProject;
        const communityIndex = Math.floor(projectIndex / profile.projectsPerCommunity);
        const createdAt = timestamp(anchor, localIndex, 180);
        return {
            _id: id("portal-comment", index),
            communityId: communityId(communityIndex).toString(),
            projectId: projectId(projectIndex).toString(),
            deliverableId: id(
                "deliverable",
                projectIndex * profile.deliverablesPerProject + (localIndex % profile.deliverablesPerProject),
            ).toString(),
            authorId: userId(
                communityIndex * profile.usersPerCommunity + (localIndex % profile.usersPerCommunity),
            ).toString(),
            body: random.pick(messageBodies),
            createdAt,
            updatedAt: createdAt,
        };
    });
    onProgress("portal comments", totals.portalComments);

    return {
        totals,
        password,
        accounts: [
            `scale_${profileName}_${options.seed}_0@scale.jirello.dev`
                .toLowerCase()
                .replace(/[^a-z0-9_@.]/g, "_"),
            `scale_${profileName}_${options.seed}_1@scale.jirello.dev`
                .toLowerCase()
                .replace(/[^a-z0-9_@.]/g, "_"),
        ],
    };
}
