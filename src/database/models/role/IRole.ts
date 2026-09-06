import { ICommunityPermissions } from "../community/ICommunityPermissions.js";
import { ICommon } from "../ICommon.js";

export type IRole = ICommon & {
    title: string;
    userIds: string[];
    communityId: string;
    permissionOverrides: ICommunityPermissions;
    permittedScreenIds: string[];
    overrideAll: boolean;
    parentRoleId: string;
    priorityPosition: number;
    projectBased: boolean;
    projectIds: string[];
};
