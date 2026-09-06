import mongoose, { Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IUser } from "./IUser.js";
import { UserAccess } from "./UserAccess.js";
import { UserNotifications } from "./UserNotifications.js";
import { UserProfile } from "./UserProfile.js";
import { UserRoles } from "./UserRoles.js";
import { UserTasks } from "./UserTasks.js";

const UserModelSchema = new mongoose.Schema(
    {
        profile: {
            type: UserProfile,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
            required: true,
        },
        communityIds: {
            type: [String],
            default: [],
            required: true,
        },
        ownedCommunityIds: {
            type: [String],
            default: [],
            required: true,
        },
        tasks: {
            type: UserTasks,
            default: () => ({}),
        },
        notifications: {
            type: UserNotifications,
            default: () => ({}),
        },
        roles: {
            type: UserRoles,
            default: () => ({}),
        },
        permittedScreenIds: {
            type: [String],
            default: [],
            required: true,
        },
        access: {
            type: UserAccess,
            default: () => ({}),
        },
    },
    {
        timestamps: true,
    },
);

UserModelSchema.index({ "profile.email": 1 }, { unique: true });
UserModelSchema.index({ "profile.username": 1 }, { unique: true });

UserModelSchema.plugin(mongoosePaginate);

const UserModel: Model<IUser> = mongoose.model<IUser>("Users", UserModelSchema);

export { UserModel };
