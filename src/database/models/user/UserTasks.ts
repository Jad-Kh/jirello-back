import mongoose from "mongoose";

const UserTasks = new mongoose.Schema(
    {
        taskIds: {
            type: Array,
            default: [],
            required: true,
        },
        taskGroupIds: {
            type: Array,
            default: [],
            required: true,
        },
        taskPerWeekAverage: {
            type: Number,
            default: 0,
            required: false,
        }
    },
    {
        timestamps: true,
    }
);

export { UserTasks }