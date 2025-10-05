import { ICommon } from "../ICommon.ts";

export type IMeeting = ICommon & {
    name: string;
    schedule: string;
    organizerIds: string[];
    userIds: string[];
    project: string;
}