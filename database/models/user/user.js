import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

import { UserProfile } from "./userProfile/userProfile.js";
import { UserTasks } from "./userTasks/userTasks.js";
import { UserNotifications } from "./userNotifications/userNotifications.js";

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
        }
    },
    {
        timestamps: true,
    }
)

UserModelSchema.plugin(mongoosePaginate);
UserModelSchema.plugin(aggregatePaginate);

const UserModel = mongoose.model("Users", UserModelSchema);
export { UserModel }