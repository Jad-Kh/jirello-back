import mongoose, { Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { CommunityPermissions } from "./CommunityPermissions.js";
import { ICommunity } from "./ICommunity.ts";

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
        },
        validationLevel: {
            type: Number,
            default: 0,
            required: true,
        },
        requiredValidationLevel: {
            type: Number,
            default: 0,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

CommunityModelSchema.plugin(mongoosePaginate);

const CommunityModel: Model<ICommunity> = mongoose.model<ICommunity>('Community', CommunityModelSchema);
export { CommunityModel }