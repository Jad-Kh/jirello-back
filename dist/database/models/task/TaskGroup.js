"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskGroupModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const TaskGroupUsers_ts_1 = require("./TaskGroupUsers.ts");
const TaskGroupModelSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    accomplished: {
        type: Boolean,
        required: true,
        default: false,
    },
    projectId: {
        type: String,
        required: true,
    },
    users: {
        type: TaskGroupUsers_ts_1.TaskGroupUsers,
    },
}, {
    timestamps: true,
});
TaskGroupModelSchema.plugin(mongoose_paginate_v2_1.default);
const TaskGroupModel = mongoose_1.default.model("TaskGroups", TaskGroupModelSchema);
exports.TaskGroupModel = TaskGroupModel;
