import { APISignature } from "../api/APISignature.js";
import { UserNotificationResponse } from "./UserNotificationResponse.js";
import { UserProfileResponse } from "./UserProfileResponse.js";
import { UserTasksResponse } from "./UserTasksResponse.js";

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
        this.isAdmin = values.isAdmin ?? false;
        this.communityIds = values.communityIds ?? [];
        this.ownedCommunityIds = values.ownedCommunityIds ?? [];
        this.tasks = new UserTasksResponse(
            values.tasks ?? {
                taskIds: [],
                taskGroupIds: [],
                taskPerWeekAverage: 0,
            },
        );
        this.notifications = new UserNotificationResponse(
            values.notifications ?? {
                mutedCommunityIds: [],
                mutedChatIds: [],
                muteAll: false,
            },
        );
    }
}
