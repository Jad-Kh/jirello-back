"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponse = void 0;
const APISignature_ts_1 = require("../api/APISignature.ts");
const UserProfileResponse_ts_1 = require("./UserProfileResponse.ts");
const UserTasksResponse_ts_1 = require("./UserTasksResponse.ts");
const UserNotificationResponse_ts_1 = require("./UserNotificationResponse.ts");
class UserResponse extends APISignature_ts_1.APISignature {
    profile;
    isAdmin;
    communityIds;
    ownedCommunityIds;
    tasks;
    notifications;
    constructor(values) {
        super(values);
        this.profile = new UserProfileResponse_ts_1.UserProfileResponse(values.profile);
        this.isAdmin = values.isAdmin;
        this.communityIds = values.communityIds;
        this.ownedCommunityIds = values.ownedCommunityIds;
        this.tasks = new UserTasksResponse_ts_1.UserTasksResponse(values.tasks);
        this.notifications = new UserNotificationResponse_ts_1.UserNotificationResponse(values.notifications);
    }
}
exports.UserResponse = UserResponse;
