import mongoose, { Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import {IProject} from "./IProject.ts";

const ProjectModelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        organizerIds: {
            type: Array,
            default: [],
            required: true,
        },
        userIds: {
            type: Array,
            default: [],
            required: true,
        },
        communityId: {
            type: String,
            required: true,
        },
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
    },
    {
        timestamps: true,
    }
);

ProjectModelSchema.plugin(mongoosePaginate);

const ProjectModel: Model<IProject> = mongoose.model<IProject>("Projects", ProjectModelSchema);
export { ProjectModel }