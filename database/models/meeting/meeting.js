import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const MeetingModel = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        schedule: {
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
        projectId: {
            type: String,
            default: "Not specified",
        },
    },
    {
        timestamps: true,
    }
)

MeetingModel.plugin(mongoosePaginate);
MeetingModel.plugin(aggregatePaginate);

const MeetingDatabaseModel = mongoose.model("Meetings", MeetingModel);
export { MeetingDatabaseModel }