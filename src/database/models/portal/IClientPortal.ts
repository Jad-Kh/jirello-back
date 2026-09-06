import { ICommon } from "../ICommon.js";

export type IClientPortal = ICommon & {
    communityId: string;
    projectId: string;
    enabled: boolean;
    name?: string;
    welcomeMessage?: string;
    logoUrl?: string;
    accentColor?: string;
    showProgress: boolean;
    showMilestones: boolean;
    showFinancials: boolean;
    publicEnabled: boolean;
    publicSlug?: string;
};
