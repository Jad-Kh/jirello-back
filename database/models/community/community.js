import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

import { CommunityPermissions } from "./communityPermissions/communityPermissions.js";

const CommunityModelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        flag: {
            type: String,
            required: true,
        },
        ownerIds: {
            type: Array,
            default: [],
            required: true,
        },
        userIds: {
            type: Array,
            default: [],
            required: true,
        },
        projectIds: {
            type: Array,
            default: [],
            required: true,
        },
        template: {
            type: String,
            default: "Normal",
            required: true,
        },
        permissions: {
            type: CommunityPermissions,
        },
        roleIds: {
            type: Array,
            default: [],
            required: true,
        },
        screenIds: {
            type: Array,
            default: [],
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

CommunityModelSchema.plugin(mongoosePaginate);
CommunityModelSchema.plugin(aggregatePaginate);

const CommunityModel = mongoose.model("Communities", CommunityModelSchema);
export { CommunityModel }