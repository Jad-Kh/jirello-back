import type { IPortalComment } from "../../database/models/portal/IPortalComment.js";
import { APISignature } from "../api/APISignature.js";

export class PortalCommentResponse extends APISignature {
    communityId: string;
    projectId: string;
    deliverableId?: string;
    taskId?: string;
    authorId: string;
    body: string;
    annotation?: IPortalComment["annotation"];
    editedAt?: Date;

    constructor(values: IPortalComment) {
        super(values);
        this.communityId = values.communityId;
        this.projectId = values.projectId;
        this.deliverableId = values.deliverableId;
        this.taskId = values.taskId;
        this.authorId = values.authorId;
        this.body = values.body;
        this.annotation = values.annotation;
        this.editedAt = values.editedAt;
    }
}
