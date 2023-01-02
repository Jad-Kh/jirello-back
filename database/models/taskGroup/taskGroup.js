import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

import { TaskGroupUsers } from "./taskGroupUsers.js/taskGroupUsers";

const TaskGroupModel = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
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
            type: TaskGroupUsers,
        }, 
    },
    {
        timestamps: true,
    }
)

TaskGroupModel.plugin(mongoosePaginate);
TaskGroupModel.plugin(aggregatePaginate);

const TaskGroupDatabaseModel = mongoose.model("TaskGroups", TaskGroupModel);
export { TaskGroupDatabaseModel }