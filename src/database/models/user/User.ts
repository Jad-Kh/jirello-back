import mongoose, { Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { UserProfile } from "./UserProfile.ts";
import { UserTasks } from "./UserTasks.ts";
import { UserNotifications } from "./UserNotifications.ts";
import { UserRoles } from "./UserRoles.ts";
import { UserAccess } from "./UserAccess.ts";
import { IUser } from "./IUser.ts";

const UserModelSchema = new mongoose.Schema(
    {
        profile: {
            type: UserProfile
        },
        isAdmin: {
            type: Boolean,
            default: false,
            required: true,
        },
        communityIds: {
            type: Array,
            default: [],
            required: true,
        },
        ownedCommunityIds: {
            type: Array,
            default: [],
            required: true,
        },
        tasks: {
            type: UserTasks,
        },
        notifications: {
            type: UserNotifications,
        },
        roles: {
            type: UserRoles
        },
        permittedScreenIds: {
            type: Array,
            default: [],
            required: true,
        },
        access: {
            type: UserAccess
        }
    },
    {
        timestamps: true,
    }
)

UserModelSchema.plugin(mongoosePaginate);

const UserModel: Model<IUser> = mongoose.model<IUser>("Users", UserModelSchema);
export { UserModel }