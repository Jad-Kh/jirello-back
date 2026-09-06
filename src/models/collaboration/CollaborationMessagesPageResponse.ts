import type { ICollaborationMessage } from "../../database/models/collaboration/ICollaborationMessage.js";
import { CollaborationMessageResponse } from "./CollaborationMessageResponse.js";

type CollaborationMessagesPage = {
    messages: ICollaborationMessage[];
    nextCursor: string | null;
    unreadCount: number;
};

export class CollaborationMessagesPageResponse {
    messages: CollaborationMessageResponse[];
    nextCursor: string | null;
    unreadCount: number;

    constructor(values: CollaborationMessagesPage) {
        this.messages = values.messages.map((message) => new CollaborationMessageResponse(message));
        this.nextCursor = values.nextCursor;
        this.unreadCount = values.unreadCount;
    }
}
