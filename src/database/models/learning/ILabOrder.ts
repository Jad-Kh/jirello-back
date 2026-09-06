import { Types } from "mongoose";

export type LabOrderStatus = "pending" | "confirmed" | "cancelled";

export type LabOrder = {
    userId: Types.ObjectId;
    clientReference: string;
    idempotencyKey: string;
    requestHash: string;
    orderNumber: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    status: LabOrderStatus;
    version: number;
    createdAt: Date;
    updatedAt: Date;
};
