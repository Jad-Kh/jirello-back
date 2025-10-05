import mongoose, {Model} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { TaskGroupUsers } from "./TaskGroupUsers.ts";
import { ITaskGroup } from "./ITaskGroup.ts";

const TaskGroupModelSchema = new mongoose.Schema(
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

TaskGroupModelSchema.plugin(mongoosePaginate);

const TaskGroupModel: Model<ITaskGroup> = mongoose.model<ITaskGroup>("TaskGroups", TaskGroupModelSchema);
export { TaskGroupModel }