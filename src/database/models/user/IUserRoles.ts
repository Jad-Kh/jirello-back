import { ICommon } from "../ICommon.ts";

export type IUserRoles = ICommon & {
    priorityRoleId: number;
    rolesIds: string[];
}