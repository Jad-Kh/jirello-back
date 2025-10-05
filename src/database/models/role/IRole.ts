import { ICommon } from "../ICommon.ts";
import { ICommunityPermissions } from "../community/ICommunityPermissions.ts";

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
}