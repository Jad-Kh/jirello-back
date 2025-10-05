import { ICommon } from "../ICommon.ts";

export type IUserTasks = ICommon & {
    taskIds: string[];
    taskGroupIds: string[];
    taskPerWeekAverage: number;
}