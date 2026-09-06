import { ICommon } from "../ICommon.js";
import { ICommunityPermissions } from "./ICommunityPermissions.js";

export type ICommunity = ICommon & {
    name: string;
    flag: string;
    ownerIds: string[];
    userIds: string[];
    projectIds: string[];
    template: string;
    permissions: ICommunityPermissions;
    roleIds: string[];
    screenIds: string[];
    validationLevel: number;
    requiredValidationLevel: number;
};
