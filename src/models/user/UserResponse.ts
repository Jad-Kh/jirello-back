import { APISignature } from "../api/APISignature.ts";
import { UserProfileResponse } from "./UserProfileResponse.ts";
import { UserTasksResponse } from "./UserTasksResponse.ts";
import { UserNotificationResponse } from "./UserNotificationResponse.ts";

export class UserResponse extends APISignature {
    profile: UserProfileResponse;
    isAdmin: boolean;
    communityIds: string[];
    ownedCommunityIds: string[];
    tasks: UserTasksResponse;
    notifications: UserNotificationResponse;

    constructor(values: UserResponse) {
        super(values);
        this.profile = new UserProfileResponse(values.profile);
        this.isAdmin = values.isAdmin;
        this.communityIds = values.communityIds;
        this.ownedCommunityIds = values.ownedCommunityIds;
        this.tasks = new UserTasksResponse(values.tasks);
        this.notifications = new UserNotificationResponse(values.notifications);
    }
}