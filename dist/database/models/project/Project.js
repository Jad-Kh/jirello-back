"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const ProjectModelSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    organizerIds: {
        type: Array,
        default: [],
        required: true,
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
    taskIds: {
        type: Array,
        default: [],
        required: true,
    },
    taskGroupIds: {
        type: Array,
        default: [],
        required: true,
    },
}, {
    timestamps: true,
});
ProjectModelSchema.plugin(mongoose_paginate_v2_1.default);
const ProjectModel = mongoose_1.default.model("Projects", ProjectModelSchema);
exports.ProjectModel = ProjectModel;
