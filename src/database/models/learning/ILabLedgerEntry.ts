import { Types } from "mongoose";

export type LabLedgerEntry = {
    orderId: Types.ObjectId;
    userId: Types.ObjectId;
    amount: number;
    kind: "order-created";
    createdAt: Date;
    updatedAt: Date;
};
