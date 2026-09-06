import { ICommon } from "../ICommon.js";

export type IPortalComment = ICommon & {
    communityId: string;
    projectId: string;
    deliverableId?: string;
    taskId?: string;
    authorId: string;
    body: string;
    annotation?: { assetUrl: string; page?: number; x?: number; y?: number };
    editedAt?: Date;
};
