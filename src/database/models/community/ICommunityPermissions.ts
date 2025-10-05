import { ICommon } from "../ICommon.ts";

export type ICommunityPermissions = ICommon & {
    tasks: string[];
    taskGroups: string[];
    meetings: string[];
    projects: string[];
    screens: string[];
    roles: string[];
};