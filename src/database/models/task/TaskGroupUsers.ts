import mongoose from "mongoose";

const TaskGroupUsers = new mongoose.Schema(
    {
        createdBy: {
            type: String,
            required: true,
        },
        reviewers: {
            type: [String],
            default: [],
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

export { TaskGroupUsers };
