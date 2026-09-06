import mongoose, { Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IScreen } from "./IScreen.js";

const ScreenModelSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 30,
        },
        url: {
            type: String,
            required: true,
        },
        communityId: {
            type: String,
            required: true,
        },
        password: {
            type: String,
        },
        protected: {
            type: Boolean,
            default: false,
        },
        allowedUserIds: {
            type: [String],
            default: [],
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

ScreenModelSchema.plugin(mongoosePaginate);

const ScreenModel: Model<IScreen> = mongoose.model<IScreen>("Screen", ScreenModelSchema);

export { ScreenModel };
