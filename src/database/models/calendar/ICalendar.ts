import { ICommon } from "../ICommon.js";

export type ICalendar = ICommon & {
    ownerId: string;
    communityId?: string;
    projectId?: string;
    name: string;
    color: string;
    timezone: string;
    visibility: "private" | "members";
    isDefault: boolean;
    archivedAt?: Date;
    version: number;
};
