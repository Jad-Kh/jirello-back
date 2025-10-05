import mongoose, { Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { CommunityPermissions } from "../community/CommunityPermissions";
import { IRole } from "./IRole.ts";

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
            type: String,
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

const RoleModel: Model<IRole> = mongoose.model<IRole>("Roles", RoleModelSchema);
export { RoleModel }