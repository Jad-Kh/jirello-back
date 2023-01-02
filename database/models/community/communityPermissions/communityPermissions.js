import mongoose from "mongoose";

const CommunityPermissions = new mongoose.Schema(
    {
        canUserViewOtherTasks: {
            type: Boolean,
            default: false,
        },
        canUserViewOtherTaskGroups: {
            type: Boolean,
            default: false,
        },
        canUserCreateTasks: {
            type: Boolean,
            default: false,
        },
        canUserCreateTaskGroups: {
            type: Boolean,
            default: false,
        },
        canUserEditTasks: {
            type: Boolean,
            default: false,
        },
        canUserSetTaskToComplete: {
            type: Boolean,
            default: false,
        },
        canUserEditTaskGroups: {
            type: Boolean,
            default: false,
        },
        canUserViewOtherProjects: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

export { CommunityPermissions }