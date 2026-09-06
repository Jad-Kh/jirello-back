import { ICommon } from "../ICommon.js";

export type IProject = ICommon & {
    name: string;
    organizerIds: string[];
    userIds: string[];
    communityId: string;
    taskIds: string[];
    taskGroupIds: string[];
};
