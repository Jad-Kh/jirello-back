import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

import { UserProfile } from "./userProfile/userProfile.js";
import { UserTasks } from "./userTasks/userTasks.js";
import { UserNotifications } from "./userNotifications/userNotifications.js";

const UserModel = new mongoose.Schema(
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

UserModel.plugin(mongoosePaginate);
UserModel.plugin(aggregatePaginate);

const UserDatabaseModel = mongoose.model("Users", UserModel);
export { UserDatabaseModel }