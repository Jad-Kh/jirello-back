import { ICommon } from "../ICommon.ts";
import { IUserProfile } from "./IUserProfile.ts";
import { IUserTasks } from "./IUserTasks.ts";
import { IUserNotifications } from "./IUserNotifications.ts";
import { IUserRoles } from "./IUserRoles.ts";
import { IUserAccess } from "./IUserAccess.ts";

export type IUser = ICommon & {
    profile: IUserProfile;
    isAdmin: boolean;
    communityIds: string[];
    ownedCommunityIds: string[];
    tasks: IUserTasks;
    notifications: IUserNotifications;
    roles?: IUserRoles;
    permittedScreenIds?: string[];
    access?: IUserAccess;
}