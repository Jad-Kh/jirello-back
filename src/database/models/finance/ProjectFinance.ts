import mongoose, { Model } from "mongoose";
import type { IProjectFinance } from "./IProjectFinance.js";
export type { IProjectFinance } from "./IProjectFinance.js";

const ProjectFinanceSchema = new mongoose.Schema<IProjectFinance>(
    {
        communityId: { type: String, required: true },
        projectId: { type: String, required: true },
        currency: { type: String, uppercase: true, minlength: 3, maxlength: 3, default: "USD" },
        budgetCents: { type: Number, min: 0 },
        defaultBillingRateCents: { type: Number, min: 0 },
        defaultCostRateCents: { type: Number, min: 0 },
        billingModel: {
            type: String,
            enum: ["non-billable", "hourly", "fixed", "retainer"],
            default: "non-billable",
        },
        retainerCents: { type: Number, min: 0 },
        memberRates: {
            type: [
                new mongoose.Schema(
                    {
                        userId: { type: String, required: true },
                        billingRateCents: { type: Number, min: 0 },
                        costRateCents: { type: Number, min: 0 },
                    },
                    { _id: false },
                ),
            ],
            default: [],
        },
        visibleToClients: { type: Boolean, default: false },
    },
    { timestamps: true },
);

ProjectFinanceSchema.index({ projectId: 1 }, { unique: true });
ProjectFinanceSchema.index({ communityId: 1 });

export const ProjectFinanceModel: Model<IProjectFinance> = mongoose.model<IProjectFinance>(
    "ProjectFinances",
    ProjectFinanceSchema,
);
