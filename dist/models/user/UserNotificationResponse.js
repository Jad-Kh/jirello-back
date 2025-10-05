"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotificationResponse = void 0;
const APISignature_ts_1 = require("../api/APISignature.ts");
class UserNotificationResponse extends APISignature_ts_1.APISignature {
    mutedCommunityIds;
    mutedChatIds;
    muteAll;
    constructor(values) {
        super(values);
        this.mutedCommunityIds = values.mutedCommunityIds;
        this.mutedChatIds = values.mutedChatIds;
        this.muteAll = values.muteAll;
    }
}
exports.UserNotificationResponse = UserNotificationResponse;
