"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTasks = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserTasks = new mongoose_1.default.Schema({
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
    taskPerWeekAverage: {
        type: Number,
        default: 0,
        required: false,
    }
}, {
    timestamps: true,
});
exports.UserTasks = UserTasks;
