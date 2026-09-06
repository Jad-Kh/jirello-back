import { ICommon } from "../ICommon.js";

export type ITaskGroupUsers = ICommon & {
    createdBy: string;
    reviewers: string[];
    userIds: string[];
};
