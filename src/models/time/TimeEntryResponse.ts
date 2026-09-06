import type { ITimeEntry } from "../../database/models/time/ITimeEntry.js";
import { APISignature } from "../api/APISignature.js";

export class TimeEntryResponse extends APISignature {
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
    status: ITimeEntry["status"];
    reviewerId?: string;
    reviewedAt?: Date;
    rejectionReason?: string;
    version: number;

    constructor(values: ITimeEntry) {
        super(values);
        this.communityId = values.communityId;
        this.projectId = values.projectId;
        this.taskId = values.taskId;
        this.userId = values.userId;
        this.description = values.description;
        this.startedAt = values.startedAt;
        this.endedAt = values.endedAt;
        this.durationMinutes = values.durationMinutes;
        this.billable = values.billable;
        this.billingRateCents = values.billingRateCents;
        this.costRateCents = values.costRateCents;
        this.currency = values.currency;
        this.status = values.status;
        this.reviewerId = values.reviewerId;
        this.reviewedAt = values.reviewedAt;
        this.rejectionReason = values.rejectionReason;
        this.version = values.version;
    }
}
