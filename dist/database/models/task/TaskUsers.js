"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskUsers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TaskUsers = new mongoose_1.default.Schema({
    createdBy: {
        type: String,
        required: true,
    },
    reviewer: {
        type: String,
        required: true,
    },
    userIds: {
        type: Array,
        default: [],
        required: true,
    }
}, {
    timestamps: true,
});
exports.TaskUsers = TaskUsers;
