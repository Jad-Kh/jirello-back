import mongoose from "mongoose";

const UserProfile = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 30,
        },
        firstName: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 25,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 25,
            trim: true,
        },
        birthday: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
    },
    { _id: false, timestamps: false },
);

export { UserProfile };
