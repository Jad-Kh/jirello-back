import { ICommon } from "../ICommon.js";

export type IUserTasks = ICommon & {
    taskIds: string[];
    taskGroupIds: string[];
    taskPerWeekAverage: number;
};
