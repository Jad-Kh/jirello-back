import { ICommon } from "../ICommon.js";

export type IMeeting = ICommon & {
    name: string;
    schedule: string;
    organizerIds: string[];
    userIds: string[];
    projectId: string;
};
