import mongoose from "mongoose";

const TaskGroupUsers = new mongoose.Schema(
    {
        createdBy: {
            type: String,
            required: true,
        },
        reviewers: {
            type: Array,
            default: [],
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

export { TaskGroupUsers }