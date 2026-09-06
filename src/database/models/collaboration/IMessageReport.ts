export type MessageReportStatus = "open" | "reviewed" | "dismissed" | "actioned";

export type IMessageReport = {
    messageId: string;
    communityId: string;
    projectId?: string;
    reporterId: string;
    reason: "spam" | "harassment" | "inappropriate" | "other";
    details?: string;
    status: MessageReportStatus;
    reviewedBy?: string;
    reviewedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
};
