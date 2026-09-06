import { ICommon } from "../ICommon.js";

export type IDeliverable = ICommon & {
    communityId: string;
    projectId: string;
    taskId?: string;
    title: string;
    description?: string;
    createdBy: string;
    dueAt?: Date;
    submittedAt?: Date;
    status: "draft" | "submitted" | "approved" | "changes-requested";
    version: number;
    decision?: { actorId: string; decidedAt: Date; note?: string };
    assets: Array<{ url: string; name: string; mimeType?: string; revision: number }>;
};
