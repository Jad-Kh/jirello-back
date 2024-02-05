import mongoose from "mongoose";

const UserAccess = new mongoose.Schema(
    {
        refreshToken: {
            type: String,
            default: '',
        }
    },
    {
        timestamps: true,
    }
)

export { UserAccess }