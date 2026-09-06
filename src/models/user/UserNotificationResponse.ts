import { APISignature } from "../api/APISignature.js";

export class UserNotificationResponse extends APISignature {
    mutedCommunityIds: string[];
    mutedChatIds: string[];
    muteAll: boolean;

    constructor(values: UserNotificationResponse) {
        super(values);
        this.mutedCommunityIds = values.mutedCommunityIds;
        this.mutedChatIds = values.mutedChatIds;
        this.muteAll = values.muteAll;
    }
}
