import { ICommon } from "../ICommon.js";

export type ITaskUsers = ICommon & {
    createdBy: string;
    reviewer: string;
    userIds: string[];
};
