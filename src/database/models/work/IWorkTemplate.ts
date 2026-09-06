import { ICommon } from "../ICommon.js";

export type IWorkTemplate = ICommon & {
    communityId: string;
    projectId?: string;
    name: string;
    description?: string;
    createdBy: string;
    typeKey: string;
    defaults: Record<string, unknown>;
};
