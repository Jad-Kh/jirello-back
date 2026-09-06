import type { ICollaborationMessage } from "../../database/models/collaboration/ICollaborationMessage.js";
import { APISignature } from "../api/APISignature.js";

export class CollaborationMessageResponse extends APISignature {
    kind: ICollaborationMessage["kind"];
    scopeType: ICollaborationMessage["scopeType"];
    scopeId: string;
    communityId: string;
    projectId?: string;
    authorId: string;
    body: string;
    parentId?: string;
    mentionedUserIds: string[];
    version: number;
    editedAt?: Date;
    deletedAt?: Date;

    constructor(values: ICollaborationMessage & { id?: string; _id?: string }) {
        super(values);
        this.kind = values.kind;
        this.scopeType = values.scopeType;
        this.scopeId = values.scopeId;
        this.communityId = values.communityId;
        this.projectId = values.projectId;
        this.authorId = values.authorId;
        this.body = values.body;
        this.parentId = values.parentId;
        this.mentionedUserIds = values.mentionedUserIds;
        this.version = values.version;
        this.editedAt = values.editedAt;
        this.deletedAt = values.deletedAt;
    }
}
