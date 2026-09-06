import mongoose, { Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IProject } from "./IProject.js";

const ProjectModelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        organizerIds: {
            type: [String],
            default: [],
            required: true,
        },
        userIds: {
            type: [String],
            default: [],
            required: true,
        },
        communityId: {
            type: String,
            required: true,
        },
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
    },
    {
        timestamps: true,
    },
);

ProjectModelSchema.index({ communityId: 1, name: 1 }, { unique: true });

ProjectModelSchema.plugin(mongoosePaginate);

const ProjectModel: Model<IProject> = mongoose.model<IProject>("Projects", ProjectModelSchema);

export { ProjectModel };
