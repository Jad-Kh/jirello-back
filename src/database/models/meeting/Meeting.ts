import mongoose, { Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IMeeting } from "./IMeeting.js";

const MeetingModelSchema = new mongoose.Schema(
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
            type: [String],
            default: [],
            required: true,
        },
        userIds: {
            type: [String],
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
    },
);

MeetingModelSchema.plugin(mongoosePaginate);

const MeetingModel: Model<IMeeting> = mongoose.model<IMeeting>("Meetings", MeetingModelSchema);

export { MeetingModel };
