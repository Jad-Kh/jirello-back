import type { INotification } from "../../database/models/notification/INotification.js";
import { APISignature } from "../api/APISignature.js";

export class NotificationResponse extends APISignature {
    recipientId: string;
    type: string;
    title: string;
    body: string;
    actorId?: string;
    communityId?: string;
    projectId?: string;
    conversationId?: string;
    resourceType?: string;
    resourceId?: string;
    readAt?: Date;

    constructor(values: INotification & { id?: string; _id?: string }) {
        super(values);
        this.recipientId = values.recipientId;
        this.type = values.type;
        this.title = values.title;
        this.body = values.body;
        this.actorId = values.actorId;
        this.communityId = values.communityId;
        this.projectId = values.projectId;
        this.conversationId = values.conversationId;
        this.resourceType = values.resourceType;
        this.resourceId = values.resourceId;
        this.readAt = values.readAt;
    }
}
