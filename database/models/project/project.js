import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const ProjectModel = new mongoose.Schema(
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
)

ProjectModel.plugin(mongoosePaginate);
ProjectModel.plugin(aggregatePaginate);

const ProjectDatabaseModel = mongoose.model("Projects", ProjectModel);
export { ProjectDatabaseModel }