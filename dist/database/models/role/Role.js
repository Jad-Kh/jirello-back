"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const CommunityPermissions_1 = require("../community/CommunityPermissions");
const RoleModelSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        min: 2,
        max: 30,
    },
    userIds: {
        type: Array,
        default: [],
        required: true,
    },
    communityId: {
        type: String,
        required: true,
    },
    permissionOverrides: {
        type: CommunityPermissions_1.CommunityPermissions,
    },
    permittedScreenIds: {
        type: Array,
        default: [],
        required: true,
    },
    overrideAll: {
        type: Boolean,
        default: false,
        required: true,
    },
    parentRoleId: {
        type: String,
        required: false,
    },
    priorityPosition: {
        type: Number,
        required: true,
    },
    projectBased: {
        type: Boolean,
        default: false,
        required: true,
    },
    projectIds: {
        type: Array,
        required: false,
    }
}, {
    timestamps: true,
});
RoleModelSchema.plugin(mongoose_paginate_v2_1.default);
const RoleModel = mongoose_1.default.model("Roles", RoleModelSchema);
exports.RoleModel = RoleModel;
