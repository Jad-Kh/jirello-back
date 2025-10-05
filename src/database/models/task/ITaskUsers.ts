import { ICommon } from "../ICommon.ts";

export type ITaskUsers = ICommon & {
    createdBy: string;
    reviewer: string;
    userIds: string[];
}