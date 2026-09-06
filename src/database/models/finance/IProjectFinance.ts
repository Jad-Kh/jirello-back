import { ICommon } from "../ICommon.js";

export type IProjectFinance = ICommon & {
    communityId: string;
    projectId: string;
    currency: string;
    budgetCents?: number;
    defaultBillingRateCents?: number;
    defaultCostRateCents?: number;
    billingModel: "non-billable" | "hourly" | "fixed" | "retainer";
    retainerCents?: number;
    memberRates: Array<{ userId: string; billingRateCents?: number; costRateCents?: number }>;
    visibleToClients: boolean;
};
