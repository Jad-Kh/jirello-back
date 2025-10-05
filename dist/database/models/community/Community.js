"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const CommunityPermissions_js_1 = require("./CommunityPermissions.js");
const CommunityModelSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    flag: {
        type: String,
        required: true,
    },
    ownerIds: {
        type: Array,
        default: [],
        required: true,
    },
    userIds: {
        type: Array,
        default: [],
        required: true,
    },
    projectIds: {
        type: Array,
        default: [],
        required: true,
    },
    template: {
        type: String,
        default: "Normal",
        required: true,
    },
    permissions: {
        type: CommunityPermissions_js_1.CommunityPermissions,
    },
    roleIds: {
        type: Array,
        default: [],
        required: true,
    },
    screenIds: {
        type: Array,
        default: [],
        required: true,
    },
    validationLevel: {
        type: Number,
        default: 0,
        required: true,
    },
    requiredValidationLevel: {
        type: Number,
        default: 0,
        required: true,
    }
}, {
    timestamps: true,
});
CommunityModelSchema.plugin(mongoose_paginate_v2_1.default);
const CommunityModel = mongoose_1.default.model('Community', CommunityModelSchema);
exports.CommunityModel = CommunityModel;
