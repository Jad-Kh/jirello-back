import type { IProjectFinance } from "../../database/models/finance/IProjectFinance.js";
import { APISignature } from "../api/APISignature.js";

export class ProjectFinanceResponse extends APISignature {
    communityId: string;
    projectId: string;
    currency: string;
    budgetCents?: number;
    defaultBillingRateCents?: number;
    defaultCostRateCents?: number;
    billingModel: IProjectFinance["billingModel"];
    retainerCents?: number;
    memberRates: IProjectFinance["memberRates"];
    visibleToClients: boolean;

    constructor(values: IProjectFinance) {
        super(values);
        this.communityId = values.communityId;
        this.projectId = values.projectId;
        this.currency = values.currency;
        this.budgetCents = values.budgetCents;
        this.defaultBillingRateCents = values.defaultBillingRateCents;
        this.defaultCostRateCents = values.defaultCostRateCents;
        this.billingModel = values.billingModel;
        this.retainerCents = values.retainerCents;
        this.memberRates = values.memberRates;
        this.visibleToClients = values.visibleToClients;
    }
}
