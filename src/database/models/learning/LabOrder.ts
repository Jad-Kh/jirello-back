import { Schema, model } from "mongoose";
import type { LabOrder } from "./ILabOrder.js";
export type { LabOrderStatus, LabOrder } from "./ILabOrder.js";

const LabOrderSchema = new Schema<LabOrder>(
    {
        userId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
        clientReference: { type: String, required: true, trim: true },
        idempotencyKey: { type: String, required: true },
        requestHash: { type: String, required: true },
        orderNumber: { type: String, required: true },
        itemName: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        total: { type: Number, required: true, min: 0 },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending",
            required: true,
        },
        version: { type: Number, required: true, default: 1 },
    },
    { timestamps: true },
);

LabOrderSchema.index({ userId: 1, clientReference: 1 }, { unique: true });
LabOrderSchema.index({ userId: 1, idempotencyKey: 1 }, { unique: true });
LabOrderSchema.index({ orderNumber: 1 }, { unique: true });
LabOrderSchema.index({ userId: 1, createdAt: -1, _id: -1 });

export const LabOrderModel = model<LabOrder>("lab-orders", LabOrderSchema);
