import mongoose, { Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IScreen } from "./IScreen.ts";

const ScreenModelSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            min: 2,
            max: 30,
        },
        url: {
            type: String,
            required: true,
        },
        communityId: {
            type: String,
            required: true,
            default: 0,
        },
        password: {
            type: String,
        },
        protected: {
            type: Boolean,
            default: false,
        },
        allowedUserIds: {
            type: Array,
            default: [],
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

ScreenModelSchema.plugin(mongoosePaginate);

const ScreenModel: Model<IScreen> = mongoose.model<IScreen>("Screen", ScreenModelSchema);
export { ScreenModel }