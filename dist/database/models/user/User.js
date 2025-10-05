"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const UserProfile_ts_1 = require("./UserProfile.ts");
const UserTasks_ts_1 = require("./UserTasks.ts");
const UserNotifications_ts_1 = require("./UserNotifications.ts");
const UserRoles_ts_1 = require("./UserRoles.ts");
const UserAccess_ts_1 = require("./UserAccess.ts");
const UserModelSchema = new mongoose_1.default.Schema({
    profile: {
        type: UserProfile_ts_1.UserProfile
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true,
    },
    communityIds: {
        type: Array,
        default: [],
        required: true,
    },
    ownedCommunityIds: {
        type: Array,
        default: [],
        required: true,
    },
    tasks: {
        type: UserTasks_ts_1.UserTasks,
    },
    notifications: {
        type: UserNotifications_ts_1.UserNotifications,
    },
    roles: {
        type: UserRoles_ts_1.UserRoles
    },
    permittedScreenIds: {
        type: Array,
        default: [],
        required: true,
    },
    access: {
        type: UserAccess_ts_1.UserAccess
    }
}, {
    timestamps: true,
});
UserModelSchema.plugin(mongoose_paginate_v2_1.default);
const UserModel = mongoose_1.default.model("Users", UserModelSchema);
exports.UserModel = UserModel;
