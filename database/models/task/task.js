import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

import { TaskUsers } from "./taskUsers/taskUsers";

const TaskModel = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            required: true,
        },
        deadline: {
            type: String,
            required: true,
            default: "Unlimited"
        },
        accomplished: {
            type: Boolean,
            required: true,
            default: false,
        },
        projectId: {
            type: String,
            required: true,
        },
        users: {
            type: TaskUsers,
        }, 
    },
    {
        timestamps: true,
    }
)

TaskModel.plugin(mongoosePaginate);
TaskModel.plugin(aggregatePaginate);

const TaskDatabaseModel = mongoose.model("Tasks", TaskModel);
export { TaskDatabaseModel }