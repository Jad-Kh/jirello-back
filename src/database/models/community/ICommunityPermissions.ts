import { ICommon } from "../ICommon.js";

export type ICommunityPermissions = ICommon & {
    tasks: number[];
    taskGroups: number[];
    meetings: number[];
    projects: number[];
    screens: number[];
    roles: number[];
    users: number[];
    communities: number[];
};
