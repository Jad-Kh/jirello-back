import { ICommon } from "../ICommon.js";

export type IUserNotifications = ICommon & {
    mutedCommunityIds: string[];
    mutedChatIds: string[];
    muteAll: boolean;
};
