import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

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
ProjectModelSchema.plugin(aggregatePaginate);

const ProjectModel = mongoose.model("Projects", ProjectModelSchema);
export { ProjectModel }