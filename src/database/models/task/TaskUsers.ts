import mongoose from "mongoose";

const TaskUsers = new mongoose.Schema(
    {
        createdBy: {
            type: String,
            required: true,
        },
        reviewer: {
            type: String,
            required: true,
        },
        userIds: {
            type: [String],
            default: [],
            required: true,
        },
    },
    { _id: false, timestamps: false },
);

export { TaskUsers };
