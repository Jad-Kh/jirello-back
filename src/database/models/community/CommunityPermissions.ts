import mongoose from "mongoose";
import { Permissions } from "../../../helpers/permissions.js";

const CommunityPermissions = new mongoose.Schema(
    {
        tasks: {
            type: [Number],
            default: [Permissions.READ_OWN],
            required: true,
        },
        taskGroups: {
            type: [Number],
            default: [Permissions.READ_OWN],
            required: true,
        },
        meetings: {
            type: [Number],
            default: [Permissions.READ_OWN],
            required: true,
        },
        projects: {
            type: [Number],
            default: [Permissions.READ_OWN],
            required: true,
        },
        screens: {
            type: [Number],
            default: [Permissions.READ_OWN],
            required: true,
        },
        roles: {
            type: [Number],
            default: [Permissions.READ_OWN],
            required: true,
        },
        users: {
            type: [Number],
            default: [Permissions.READ_OWN],
            required: true,
        },
        communities: {
            type: [Number],
            default: [Permissions.READ_OWN],
            required: true,
        },
    },
    { _id: false, timestamps: false },
);

export { CommunityPermissions };
