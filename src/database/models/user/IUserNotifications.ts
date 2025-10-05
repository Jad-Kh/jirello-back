import { ICommon } from "../ICommon.ts";

export type IUserNotifications = ICommon & {
    mutedCommunityIds: string[];
    mutedChatIds: string[];
    muteAll: boolean;
};