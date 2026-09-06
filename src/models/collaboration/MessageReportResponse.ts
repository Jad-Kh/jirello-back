import type { IMessageReport } from "../../database/models/collaboration/IMessageReport.js";
import { APISignature } from "../api/APISignature.js";

export class MessageReportResponse extends APISignature {
    messageId: string;
    communityId: string;
    projectId?: string;
    reporterId: string;
    reason: IMessageReport["reason"];
    details?: string;
    status: IMessageReport["status"];
    reviewedBy?: string;
    reviewedAt?: Date;

    constructor(values: IMessageReport & { id?: string; _id?: string }) {
        super(values);
        this.messageId = values.messageId;
        this.communityId = values.communityId;
        this.projectId = values.projectId;
        this.reporterId = values.reporterId;
        this.reason = values.reason;
        this.details = values.details;
        this.status = values.status;
        this.reviewedBy = values.reviewedBy;
        this.reviewedAt = values.reviewedAt;
    }
}
