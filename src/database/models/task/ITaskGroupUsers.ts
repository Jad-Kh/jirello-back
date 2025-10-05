import { ICommon } from "../ICommon.ts";

export type ITaskGroupUsers = ICommon & {
    createdBy: string;
    reviewers: string[];
    userIds: string[];
}