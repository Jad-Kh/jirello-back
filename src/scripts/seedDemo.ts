import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { CalendarModel } from "../database/models/calendar/Calendar.js";
import { CalendarEventModel } from "../database/models/calendar/CalendarEvent.js";
import { CollaborationMessageModel } from "../database/models/collaboration/CollaborationMessage.js";
import { CommunityModel } from "../database/models/community/Community.js";
import { CommunityInvitationModel } from "../database/models/invitation/CommunityInvitation.js";
import { NotificationModel } from "../database/models/notification/Notification.js";
import { ClientPortalModel } from "../database/models/portal/ClientPortal.js";
import { DeliverableModel } from "../database/models/portal/Deliverable.js";
import { GuestAccessModel } from "../database/models/portal/GuestAccess.js";
import { PortalCommentModel } from "../database/models/portal/PortalComment.js";
import { ProjectModel } from "../database/models/project/Project.js";
import { RoleModel } from "../database/models/role/Role.js";
import { TaskModel } from "../database/models/task/Task.js";
import { MemberCapacityModel } from "../database/models/time/MemberCapacity.js";
import { ProjectFinanceModel } from "../database/models/finance/ProjectFinance.js";
import { TimeEntryModel } from "../database/models/time/TimeEntry.js";
import { UserModel } from "../database/models/user/User.js";
import { SavedWorkViewModel } from "../database/models/work/SavedWorkView.js";
import { WorkConfigurationModel } from "../database/models/work/WorkConfiguration.js";
import { WorkTemplateModel } from "../database/models/work/WorkTemplate.js";

const uri = process.env.MONGO_CONNECT_URI ?? "mongodb://127.0.0.1:27018/jirello?directConnection=true";
const password = process.env.DEMO_PASSWORD ?? "JirelloDemo123!";

const objectId = (suffix: string) => new mongoose.Types.ObjectId(`64f0000000000000000000${suffix}`);
const ids = {
    owner: objectId("01"),
    member: objectId("02"),
    client: objectId("03"),
    community: objectId("10"),
    project: objectId("20"),
    secondProject: objectId("21"),
    ownerRole: objectId("30"),
    memberRole: objectId("31"),
    taskOne: objectId("40"),
    taskTwo: objectId("41"),
    taskThree: objectId("42"),
    taskFour: objectId("43"),
    calendar: objectId("50"),
    event: objectId("51"),
    message: objectId("60"),
    notification: objectId("61"),
    invitation: objectId("62"),
    capacity: objectId("70"),
    timeEntry: objectId("71"),
    finance: objectId("72"),
    workConfiguration: objectId("80"),
    workTemplate: objectId("81"),
    workView: objectId("82"),
    portal: objectId("90"),
    guestAccess: objectId("91"),
    deliverable: objectId("92"),
    portalComment: objectId("93"),
};

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

const asString = (id: mongoose.Types.ObjectId) => id.toString();
const now = new Date();

const inDays = (days: number, hour = 10) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    date.setHours(hour, 0, 0, 0);
    return date;
};

async function clearPreviousDemo() {
    const communityId = asString(ids.community);
    const projectIds = [asString(ids.project), asString(ids.secondProject)];
    const userIds = [asString(ids.owner), asString(ids.member), asString(ids.client)];
    await Promise.all([
        UserModel.deleteMany({
            "profile.email": { $in: ["demo@jirello.dev", "maya@jirello.dev", "client@jirello.dev"] },
        }),
        CommunityModel.deleteMany({ _id: ids.community }),
        ProjectModel.deleteMany({ _id: { $in: [ids.project, ids.secondProject] } }),
        RoleModel.deleteMany({ communityId }),
        TaskModel.deleteMany({ projectId: { $in: projectIds } }),
        CalendarModel.deleteMany({ communityId }),
        CalendarEventModel.deleteMany({ communityId }),
        CollaborationMessageModel.deleteMany({ communityId }),
        NotificationModel.deleteMany({ recipientId: { $in: userIds } }),
        CommunityInvitationModel.deleteMany({ communityId }),
        MemberCapacityModel.deleteMany({ communityId }),
        TimeEntryModel.deleteMany({ communityId }),
        ProjectFinanceModel.deleteMany({ communityId }),
        WorkConfigurationModel.deleteMany({ communityId }),
        WorkTemplateModel.deleteMany({ communityId }),
        SavedWorkViewModel.deleteMany({ communityId }),
        ClientPortalModel.deleteMany({ communityId }),
        GuestAccessModel.deleteMany({ communityId }),
        DeliverableModel.deleteMany({ communityId }),
        PortalCommentModel.deleteMany({ communityId }),
    ]);
}

async function seedCore() {
    const hashedPassword = await bcrypt.hash(password, 10);
    const communityId = asString(ids.community);
    const projectId = asString(ids.project);
    const ownerId = asString(ids.owner);
    const memberId = asString(ids.member);
    const ownerRoleId = asString(ids.ownerRole);
    const memberRoleId = asString(ids.memberRole);

    await RoleModel.insertMany([
        {
            _id: ids.ownerRole,
            title: "Workspace Owner",
            userIds: [ownerId],
            communityId,
            permissionOverrides: permissions,
            overrideAll: true,
            priorityPosition: 0,
            projectBased: false,
        },
        {
            _id: ids.memberRole,
            title: "Product Team",
            userIds: [memberId],
            communityId,
            permissionOverrides: permissions,
            overrideAll: false,
            priorityPosition: 1,
            projectBased: true,
            projectIds: [projectId],
        },
    ]);

    await UserModel.insertMany([
        {
            _id: ids.owner,
            profile: {
                username: "demo",
                firstName: "Alex",
                lastName: "Morgan",
                birthday: "1992-05-14",
                email: "demo@jirello.dev",
                password: hashedPassword,
            },
            isAdmin: true,
            communityIds: [communityId],
            ownedCommunityIds: [communityId],
            roles: { priorityRoleId: ownerRoleId, roleIds: [ownerRoleId] },
        },
        {
            _id: ids.member,
            profile: {
                username: "maya",
                firstName: "Maya",
                lastName: "Chen",
                birthday: "1994-09-22",
                email: "maya@jirello.dev",
                password: hashedPassword,
            },
            communityIds: [communityId],
            roles: { priorityRoleId: memberRoleId, roleIds: [memberRoleId] },
        },
        {
            _id: ids.client,
            profile: {
                username: "client",
                firstName: "Jamie",
                lastName: "Rivera",
                birthday: "1989-02-10",
                email: "client@jirello.dev",
                password: hashedPassword,
            },
        },
    ]);

    await ProjectModel.insertMany([
        {
            _id: ids.project,
            name: "Jirello Launch",
            communityId,
            organizerIds: [ownerId],
            userIds: [ownerId, memberId],
            taskIds: [
                asString(ids.taskOne),
                asString(ids.taskTwo),
                asString(ids.taskThree),
                asString(ids.taskFour),
            ],
        },
        {
            _id: ids.secondProject,
            name: "Customer Research",
            communityId,
            organizerIds: [memberId],
            userIds: [ownerId, memberId],
        },
    ]);

    await CommunityModel.create({
        _id: ids.community,
        name: "Jirello Demo Studio",
        flag: "DEMO",
        ownerIds: [ownerId],
        userIds: [ownerId, memberId],
        projectIds: [projectId, asString(ids.secondProject)],
        roleIds: [ownerRoleId, memberRoleId],
        template: "Product",
        permissions,
    });
}

async function seedWork() {
    const communityId = asString(ids.community);
    const projectId = asString(ids.project);
    const ownerId = asString(ids.owner);
    const memberId = asString(ids.member);
    const taskSeeds = [
        {
            _id: ids.taskOne,
            title: "Polish onboarding flow",
            description: "Reduce friction from sign-up to the first useful workspace.",
            status: "todo",
            priority: "high",
            position: 0,
            users: { createdBy: ownerId, reviewer: ownerId, userIds: [memberId] },
            deadlineAt: inDays(3),
            deadline: inDays(3).toISOString(),
            tags: ["frontend", "activation"],
            estimatedMinutes: 420,
        },
        {
            _id: ids.taskTwo,
            title: "Validate realtime presence",
            description: "Exercise project channels, mentions, and reconnect behavior.",
            status: "in-progress",
            priority: "urgent",
            position: 0,
            users: { createdBy: ownerId, reviewer: ownerId, userIds: [ownerId, memberId] },
            deadlineAt: inDays(1),
            deadline: inDays(1).toISOString(),
            tags: ["realtime"],
            estimatedMinutes: 240,
        },
        {
            _id: ids.taskThree,
            title: "Review client portal copy",
            description: "Approve launch-facing status and deliverable language.",
            status: "review",
            priority: "normal",
            position: 0,
            users: { createdBy: ownerId, reviewer: ownerId, userIds: [ownerId] },
            deadlineAt: inDays(5),
            deadline: inDays(5).toISOString(),
            audience: "client",
            tags: ["content"],
            estimatedMinutes: 90,
        },
        {
            _id: ids.taskFour,
            title: "Define success metrics",
            description: "Agree on activation, retention, and cycle-time measures.",
            status: "done",
            priority: "normal",
            position: 0,
            users: { createdBy: ownerId, reviewer: ownerId, userIds: [ownerId] },
            accomplished: true,
            tags: ["strategy"],
            estimatedMinutes: 120,
        },
    ];
    await TaskModel.insertMany(
        taskSeeds.map((task) => ({ projectId, typeKey: "task", version: 1, ...task })),
    );
    await WorkConfigurationModel.create({
        _id: ids.workConfiguration,
        communityId,
        projectId,
        key: "product-workflow",
        name: "Product delivery",
        description: "The default Jirello demo workflow.",
        color: "#7557d8",
        statuses: [
            { key: "backlog", name: "Backlog", category: "todo", position: 0 },
            { key: "todo", name: "To do", category: "todo", position: 1 },
            { key: "in-progress", name: "In progress", category: "in-progress", position: 2 },
            { key: "review", name: "Review", category: "in-progress", position: 3 },
            { key: "done", name: "Done", category: "done", position: 4 },
        ],
        fields: [
            {
                key: "impact",
                label: "Impact",
                type: "select",
                required: false,
                options: ["Low", "Medium", "High"],
            },
        ],
        transitions: [
            { from: "todo", to: "in-progress" },
            { from: "in-progress", to: "review" },
            { from: "review", to: "done" },
        ],
        isDefault: true,
    });
    await WorkTemplateModel.create({
        _id: ids.workTemplate,
        communityId,
        projectId,
        name: "Feature launch",
        description: "Reusable launch checklist.",
        createdBy: ownerId,
        typeKey: "task",
        defaults: { priority: "normal", tags: ["launch"] },
    });
    await SavedWorkViewModel.create({
        _id: ids.workView,
        communityId,
        projectId,
        ownerId,
        name: "Launch board",
        visibility: "project",
        layout: "board",
        filters: { tags: ["launch"] },
        sort: [{ field: "position", direction: "asc" }],
        groupBy: "status",
    });
}

async function seedCollaborationAndPlanning() {
    const communityId = asString(ids.community);
    const projectId = asString(ids.project);
    const ownerId = asString(ids.owner);
    const memberId = asString(ids.member);
    await CollaborationMessageModel.insertMany([
        {
            _id: ids.message,
            kind: "chat",
            scopeType: "project",
            scopeId: projectId,
            communityId,
            projectId,
            authorId: memberId,
            body: "The onboarding prototype is ready for a focused review. @demo",
            mentionedUserIds: [ownerId],
            version: 1,
        },
        {
            kind: "chat",
            scopeType: "project",
            scopeId: projectId,
            communityId,
            projectId,
            authorId: ownerId,
            body: "Great—I'll review it before our planning session.",
            mentionedUserIds: [],
            version: 1,
        },
    ]);
    await NotificationModel.insertMany([
        {
            _id: ids.notification,
            recipientId: ownerId,
            type: "mention",
            title: "Maya mentioned you",
            body: "The onboarding prototype is ready for review.",
            actorId: memberId,
            communityId,
            projectId,
            conversationId: projectId,
            resourceType: "message",
            resourceId: asString(ids.message),
            dedupeKey: "demo-mention-owner",
        },
        {
            recipientId: ownerId,
            type: "deadline",
            title: "Deadline approaching",
            body: "Validate realtime presence is due tomorrow.",
            communityId,
            projectId,
            resourceType: "task",
            resourceId: asString(ids.taskTwo),
            dedupeKey: "demo-deadline-owner",
        },
    ]);
    await CommunityInvitationModel.create({
        _id: ids.invitation,
        communityId,
        invitedUserId: asString(ids.client),
        invitedBy: ownerId,
        status: "pending",
        expiresAt: inDays(14),
    });
    await CalendarModel.create({
        _id: ids.calendar,
        ownerId,
        communityId,
        projectId,
        name: "Launch calendar",
        color: "#7557d8",
        timezone: "Asia/Beirut",
        visibility: "members",
        isDefault: true,
        version: 1,
    });
    await CalendarEventModel.create({
        _id: ids.event,
        ownerId,
        organizerId: ownerId,
        calendarId: asString(ids.calendar),
        communityId,
        projectId,
        kind: "meeting",
        title: "Jirello launch planning",
        description: "Review readiness, risks, and the next demo milestone.",
        startAt: inDays(2, 11),
        endAt: inDays(2, 12),
        timezone: "Asia/Beirut",
        visibility: "project",
        availability: "busy",
        status: "confirmed",
        attendees: [{ userId: memberId, name: "Maya Chen", optional: false, response: "accepted" }],
        reminders: [{ minutesBefore: 30, method: "notification" }],
        version: 1,
    });
}

async function seedTimeAndPortal() {
    const communityId = asString(ids.community);
    const projectId = asString(ids.project);
    const ownerId = asString(ids.owner);
    const memberId = asString(ids.member);
    const clientId = asString(ids.client);
    await MemberCapacityModel.insertMany([
        {
            _id: ids.capacity,
            communityId,
            userId: ownerId,
            timezone: "Asia/Beirut",
            weeklyMinutes: 2400,
            workingDays: [1, 2, 3, 4, 5],
            dailyMinutes: 480,
        },
        {
            communityId,
            userId: memberId,
            timezone: "Asia/Beirut",
            weeklyMinutes: 2100,
            workingDays: [1, 2, 3, 4, 5],
            dailyMinutes: 420,
        },
    ]);
    await TimeEntryModel.insertMany([
        {
            _id: ids.timeEntry,
            communityId,
            projectId,
            taskId: asString(ids.taskOne),
            userId: memberId,
            description: "Onboarding interaction pass",
            startedAt: inDays(-1, 9),
            endedAt: inDays(-1, 12),
            durationMinutes: 180,
            billable: true,
            billingRateCents: 12500,
            costRateCents: 6500,
            currency: "USD",
            status: "approved",
            reviewerId: ownerId,
            reviewedAt: now,
            version: 1,
        },
        {
            communityId,
            projectId,
            taskId: asString(ids.taskTwo),
            userId: ownerId,
            description: "Realtime integration review",
            startedAt: inDays(0, 8),
            endedAt: inDays(0, 10),
            durationMinutes: 120,
            billable: true,
            billingRateCents: 15000,
            costRateCents: 8000,
            currency: "USD",
            status: "draft",
            version: 1,
        },
    ]);
    await ProjectFinanceModel.create({
        _id: ids.finance,
        communityId,
        projectId,
        currency: "USD",
        budgetCents: 7500000,
        defaultBillingRateCents: 13500,
        defaultCostRateCents: 7000,
        billingModel: "fixed",
        memberRates: [
            { userId: ownerId, billingRateCents: 15000, costRateCents: 8000 },
            { userId: memberId, billingRateCents: 12500, costRateCents: 6500 },
        ],
        visibleToClients: false,
    });
    await ClientPortalModel.create({
        _id: ids.portal,
        communityId,
        projectId,
        enabled: true,
        name: "Jirello Launch",
        welcomeMessage: "A clear view of launch progress, deliverables, and decisions.",
        accentColor: "#7557d8",
        showProgress: true,
        showMilestones: true,
        showFinancials: false,
        publicEnabled: true,
        publicSlug: "jirello-launch-demo",
    });
    await GuestAccessModel.create({
        _id: ids.guestAccess,
        communityId,
        projectId,
        userId: clientId,
        invitedBy: ownerId,
        role: "approver",
        status: "active",
        expiresAt: inDays(60),
    });
    await DeliverableModel.create({
        _id: ids.deliverable,
        communityId,
        projectId,
        taskId: asString(ids.taskThree),
        title: "Launch experience prototype",
        description: "Responsive prototype covering onboarding, projects, and collaboration.",
        createdBy: memberId,
        dueAt: inDays(5),
        submittedAt: now,
        status: "submitted",
        version: 1,
        assets: [
            {
                url: "https://example.com/jirello-prototype",
                name: "Jirello prototype",
                mimeType: "text/html",
                revision: 1,
            },
        ],
    });
    await PortalCommentModel.create({
        _id: ids.portalComment,
        communityId,
        projectId,
        deliverableId: asString(ids.deliverable),
        authorId: clientId,
        body: "The direction looks strong. Please clarify the empty state on the project board.",
    });
}

async function main() {
    await mongoose.connect(uri);
    await clearPreviousDemo();
    await seedCore();
    await seedWork();
    await seedCollaborationAndPlanning();
    await seedTimeAndPortal();
    console.log(
        JSON.stringify(
            {
                database: mongoose.connection.name,
                communityId: asString(ids.community),
                projectId: asString(ids.project),
                publicPortal: "jirello-launch-demo",
                accounts: ["demo@jirello.dev", "maya@jirello.dev", "client@jirello.dev"],
                password,
            },
            null,
            2,
        ),
    );
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
