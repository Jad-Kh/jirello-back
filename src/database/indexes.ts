import { CollaborationMessageModel } from "./models/collaboration/CollaborationMessage.js";
import { ConversationReadModel } from "./models/collaboration/ConversationRead.js";
import { MessageReportModel } from "./models/collaboration/MessageReport.js";
import { CommunityModel } from "./models/community/Community.js";
import { CommunityInvitationModel } from "./models/invitation/CommunityInvitation.js";
import { NotificationModel } from "./models/notification/Notification.js";
import { OutboxEventModel } from "./models/outbox/OutboxEvent.js";
import { ProjectModel } from "./models/project/Project.js";
import { RoleModel } from "./models/role/Role.js";
import { TaskModel } from "./models/task/Task.js";
import { UserModel } from "./models/user/User.js";
import { CalendarEventModel } from "./models/calendar/CalendarEvent.js";
import { CalendarModel } from "./models/calendar/Calendar.js";
import { CalendarReminderDeliveryModel } from "./models/calendar/CalendarReminderDelivery.js";
import { ClientPortalModel } from "./models/portal/ClientPortal.js";
import { DeliverableModel } from "./models/portal/Deliverable.js";
import { GuestAccessModel } from "./models/portal/GuestAccess.js";
import { PortalCommentModel } from "./models/portal/PortalComment.js";
import { MemberCapacityModel } from "./models/time/MemberCapacity.js";
import { ProjectFinanceModel } from "./models/finance/ProjectFinance.js";
import { TimeEntryModel } from "./models/time/TimeEntry.js";
import { SavedWorkViewModel } from "./models/work/SavedWorkView.js";
import { WorkConfigurationModel } from "./models/work/WorkConfiguration.js";
import { WorkTemplateModel } from "./models/work/WorkTemplate.js";
import { LabLedgerEntryModel } from "./models/learning/LabLedgerEntry.js";
import { LabOrderModel } from "./models/learning/LabOrder.js";

export async function ensureDatabaseIndexes(): Promise<void> {
    await Promise.all([
        CommunityModel.createIndexes(),
        ProjectModel.createIndexes(),
        RoleModel.createIndexes(),
        UserModel.createIndexes(),
        OutboxEventModel.createIndexes(),
        NotificationModel.createIndexes(),
        TaskModel.createIndexes(),
        CollaborationMessageModel.createIndexes(),
        ConversationReadModel.createIndexes(),
        CommunityInvitationModel.createIndexes(),
        MessageReportModel.createIndexes(),
        WorkConfigurationModel.createIndexes(),
        WorkTemplateModel.createIndexes(),
        SavedWorkViewModel.createIndexes(),
        TimeEntryModel.createIndexes(),
        MemberCapacityModel.createIndexes(),
        ProjectFinanceModel.createIndexes(),
        GuestAccessModel.createIndexes(),
        ClientPortalModel.createIndexes(),
        DeliverableModel.createIndexes(),
        PortalCommentModel.createIndexes(),
        CalendarEventModel.createIndexes(),
        CalendarModel.createIndexes(),
        CalendarReminderDeliveryModel.createIndexes(),
        LabOrderModel.createIndexes(),
        LabLedgerEntryModel.createIndexes(),
    ]);
}
