import mongoose from "mongoose";

const UserRoles = new mongoose.Schema(
    {
        priorityRoleId: {
            type: Number,
            default: 1,
            required: true,
        },
        roleIds: {
            type: Array,
            default: [1],
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

export { UserRoles }