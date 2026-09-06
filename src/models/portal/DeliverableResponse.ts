import type { IDeliverable } from "../../database/models/portal/IDeliverable.js";
import { APISignature } from "../api/APISignature.js";

export class DeliverableResponse extends APISignature {
    communityId: string;
    projectId: string;
    taskId?: string;
    title: string;
    description?: string;
    createdBy: string;
    dueAt?: Date;
    submittedAt?: Date;
    status: IDeliverable["status"];
    version: number;
    decision?: IDeliverable["decision"];
    assets: IDeliverable["assets"];

    constructor(values: IDeliverable) {
        super(values);
        this.communityId = values.communityId;
        this.projectId = values.projectId;
        this.taskId = values.taskId;
        this.title = values.title;
        this.description = values.description;
        this.createdBy = values.createdBy;
        this.dueAt = values.dueAt;
        this.submittedAt = values.submittedAt;
        this.status = values.status;
        this.version = values.version;
        this.decision = values.decision;
        this.assets = values.assets;
    }
}
