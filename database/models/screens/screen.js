import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

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
        }
    },
    {
        timestamps: true,
    }
)

ScreenModelSchema.plugin(mongoosePaginate);
ScreenModelSchema.plugin(aggregatePaginate);

const ScreenModel = mongoose.model("Screen", ScreenModelSchema);
export { ScreenModel }