import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

import { CommunityPermissions } from "../community/communityPermissions/communityPermissions.js";

const RoleModelSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            min: 2,
            max: 30,
        },
        userIds: {
            type: Array,
            default: [],
            required: true,
        },
        communityId: {
            type: Number,
            required: true,
        },
        permissionOverrides: {
            type: CommunityPermissions,
        },
        permittedScreenIds: {
            type: Array,
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
            type: Array,
            required: false,
        }
    },
    {
        timestamps: true,
    }
)

RoleModelSchema.plugin(mongoosePaginate);
RoleModelSchema.plugin(aggregatePaginate);

const RoleModel = mongoose.model("Roles", RoleModelSchema);
export { RoleModel }