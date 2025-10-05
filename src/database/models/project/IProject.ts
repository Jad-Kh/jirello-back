import { ICommon } from "../ICommon.ts";

export type IProject = ICommon & {
    name: string;
    organizerIds: string[];
    userIds: string[];
    communityIds: string[];
    taskIds: string[];
    taskGroupIds: string[];
}