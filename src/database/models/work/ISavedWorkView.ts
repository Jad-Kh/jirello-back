import { ICommon } from "../ICommon.js";

export type ISavedWorkView = ICommon & {
    communityId: string;
    projectId?: string;
    ownerId: string;
    name: string;
    visibility: "private" | "project" | "community";
    layout: "board" | "list" | "table" | "calendar" | "timeline";
    filters: Record<string, unknown>;
    sort: Array<{ field: string; direction: "asc" | "desc" }>;
    groupBy?: string;
};
