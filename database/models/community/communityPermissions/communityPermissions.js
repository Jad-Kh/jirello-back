import mongoose from "mongoose";
import { Permissions } from "../../../../helpers/permissions";

const CommunityPermissions = new mongoose.Schema(
    {
        tasks: {
            type: Array,
            default: [Permissions.READ_OWN],
            required: true,
        },
        taskGroups: {
            type: Array,
            default: [Permissions.READ_OWN],
            required: true,
        },
        meetings: {
            type: Array,
            default: [Permissions.READ_OWN],
            required: true,
        },
        projects: {
            type: Array,
            default: [Permissions.READ_OWN],
            required: true,
        },
        screens: {
            type: Array,
            default: [Permissions.READ_OWN],
            required: true,
        },
        roles: {
            type: Array,
            default: [Permissions.READ_OWN],
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

export { CommunityPermissions }