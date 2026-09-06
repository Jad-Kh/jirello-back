import mongoose from "mongoose";

const UserRoles = new mongoose.Schema(
    {
        priorityRoleId: {
            type: String,
        },
        roleIds: {
            type: [String],
            default: [],
            required: true,
        },
    },
    { _id: false, timestamps: false },
);

export { UserRoles };
