import mongoose from "mongoose";

const UserTasks = new mongoose.Schema(
    {
        taskIds: {
            type: [String],
            default: [],
            required: true,
        },
        taskGroupIds: {
            type: [String],
            default: [],
            required: true,
        },
        taskPerWeekAverage: {
            type: Number,
            default: 0,
            required: false,
        },
    },
    { _id: false, timestamps: false },
);

export { UserTasks };
