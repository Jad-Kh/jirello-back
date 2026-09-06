import mongoose, { Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { CommunityPermissions } from "../community/CommunityPermissions.js";
import { IRole } from "./IRole.js";

const RoleModelSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 30,
            trim: true,
        },
        userIds: {
            type: [String],
            default: [],
            required: true,
        },
        communityId: {
            type: String,
            required: true,
        },
        permissionOverrides: {
            type: CommunityPermissions,
            default: () => ({}),
        },
        permittedScreenIds: {
            type: [String],
            default: [],
            required: true,
        },
        overrideAll: {
            type: Boolean,
            default: false,
            required: true,
        },
        parentRoleId: {
            type: String,
            required: false,
        },
        priorityPosition: {
            type: Number,
            required: true,
        },
        projectBased: {
            type: Boolean,
            default: false,
            required: true,
        },
        projectIds: {
            type: [String],
            default: [],
            required: false,
        },
    },
    {
        timestamps: true,
    },
);

RoleModelSchema.index({ communityId: 1, title: 1 }, { unique: true });

RoleModelSchema.plugin(mongoosePaginate);

const RoleModel: Model<IRole> = mongoose.model<IRole>("Roles", RoleModelSchema);

export { RoleModel };
