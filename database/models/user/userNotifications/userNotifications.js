import mongoose from "mongoose";

const UserNotifications = new mongoose.Schema(
    {
        mutedCommunityIds: {
            type: Array,
            default: [],
        },
        mutedChatIds: {
            type: Array,
            default: [],
        },
        muteAll: {
            type: Boolean,
            default: false,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

export { UserNotifications }