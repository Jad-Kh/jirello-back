import { ICommon } from "../ICommon.js";

export type IMemberCapacity = ICommon & {
    communityId: string;
    userId: string;
    timezone: string;
    weeklyMinutes: number;
    workingDays: number[];
    dailyMinutes: number;
    overrides: Array<{ date: string; availableMinutes: number; note?: string }>;
};
