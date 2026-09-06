import mongoose from "mongoose";

const UserAccess = new mongoose.Schema(
    {
        refreshToken: {
            type: String,
            default: "",
        },
        passwordResetToken: {
            type: String,
            default: "",
        },
        passwordResetExpiresAt: {
            type: Date,
        },
    },
    { _id: false, timestamps: false },
);

export { UserAccess };
