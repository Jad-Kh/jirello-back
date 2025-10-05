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
            type: Array,
            default: [],
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

export { TaskUsers }