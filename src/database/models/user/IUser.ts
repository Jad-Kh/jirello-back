import { ICommon } from "../ICommon.js";
import { IUserAccess } from "./IUserAccess.js";
import { IUserNotifications } from "./IUserNotifications.js";
import { IUserProfile } from "./IUserProfile.js";
import { IUserRoles } from "./IUserRoles.js";
import { IUserTasks } from "./IUserTasks.js";

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
};
