import mongoose from "mongoose";

const UserNotifications = new mongoose.Schema(
    {
        mutedCommunityIds: {
            type: [String],
            default: [],
        },
        mutedChatIds: {
            type: [String],
            default: [],
        },
        muteAll: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    { _id: false, timestamps: false },
);

export { UserNotifications };
