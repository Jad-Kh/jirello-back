import { ICommon } from "../ICommon.js";

export type ITimeEntry = ICommon & {
    communityId: string;
    projectId?: string;
    taskId?: string;
    userId: string;
    description?: string;
    startedAt: Date;
    endedAt?: Date;
    durationMinutes?: number;
    billable: boolean;
    billingRateCents?: number;
    costRateCents?: number;
    currency: string;
    status: "draft" | "submitted" | "approved" | "rejected";
    reviewerId?: string;
    reviewedAt?: Date;
    rejectionReason?: string;
    version: number;
};
