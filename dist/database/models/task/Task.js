"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const TaskUsers_ts_1 = require("./TaskUsers.ts");
const TaskModelSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        required: true,
    },
    deadline: {
        type: String,
        required: true,
        default: "Unlimited"
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
    status: {
        type: String,
        required: true,
        default: "To do",
    },
    users: {
        type: TaskUsers_ts_1.TaskUsers,
    },
}, {
    timestamps: true,
});
TaskModelSchema.plugin(mongoose_paginate_v2_1.default);
const TaskModel = mongoose_1.default.model("Tasks", TaskModelSchema);
exports.TaskModel = TaskModel;
