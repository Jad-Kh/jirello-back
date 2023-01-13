import mongoose from "mongoose";

const UserProfile = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            min: 2,
            max: 30,
        },
        firstName: {
            type: String,
            required: true,
            min: 2,
            max: 25,
        },
        lastName: {
            type: String,
            required: true,
            min: 2,
            max: 25,
        },
        birthday: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            min: 8,
        }
    },
    {
        timestamps: true,
    }
)

export { UserProfile }