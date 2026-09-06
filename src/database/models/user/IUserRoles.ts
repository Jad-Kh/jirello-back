import { ICommon } from "../ICommon.js";

export type IUserRoles = ICommon & {
    priorityRoleId?: string;
    roleIds: string[];
};
