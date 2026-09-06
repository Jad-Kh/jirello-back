import mongoose, { Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { CommunityPermissions } from "./CommunityPermissions.js";
import { ICommunity } from "./ICommunity.js";

const CommunityModelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        flag: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
        },
        ownerIds: {
            type: [String],
            default: [],
            required: true,
        },
        userIds: {
            type: [String],
            default: [],
            required: true,
        },
        projectIds: {
            type: [String],
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
            default: () => ({}),
        },
        roleIds: {
            type: [String],
            default: [],
            required: true,
        },
        screenIds: {
            type: [String],
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
        },
    },
    {
        timestamps: true,
    },
);

CommunityModelSchema.index({ name: 1 }, { unique: true });
CommunityModelSchema.index({ flag: 1 }, { unique: true });

CommunityModelSchema.plugin(mongoosePaginate);

const CommunityModel: Model<ICommunity> = mongoose.model<ICommunity>("Community", CommunityModelSchema);

export { CommunityModel };
