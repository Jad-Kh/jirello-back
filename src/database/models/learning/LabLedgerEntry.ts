import { Schema, model } from "mongoose";
import type { LabLedgerEntry } from "./ILabLedgerEntry.js";
export type { LabLedgerEntry } from "./ILabLedgerEntry.js";

const LabLedgerEntrySchema = new Schema<LabLedgerEntry>(
    {
        orderId: { type: Schema.Types.ObjectId, required: true, ref: "lab-orders" },
        userId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
        amount: { type: Number, required: true },
        kind: { type: String, enum: ["order-created"], required: true },
    },
    { timestamps: true },
);

LabLedgerEntrySchema.index({ orderId: 1 }, { unique: true });
LabLedgerEntrySchema.index({ userId: 1, createdAt: -1 });

export const LabLedgerEntryModel = model<LabLedgerEntry>("lab-ledger-entries", LabLedgerEntrySchema);
