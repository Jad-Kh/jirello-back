import mongoose, {Model} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { TaskUsers } from "./TaskUsers.ts";
import { ITask } from "./ITask.ts";

const TaskModelSchema = new mongoose.Schema(
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
        status: {
            type: String,
            required: true,
            default: "To do",
        },
        users: {
            type: TaskUsers,
        },
    },
    {
        timestamps: true,
    }
)

TaskModelSchema.plugin(mongoosePaginate);

const TaskModel: Model<ITask> = mongoose.model<ITask>("Tasks", TaskModelSchema);
export { TaskModel }