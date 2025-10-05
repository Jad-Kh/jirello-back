"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotifications = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserNotifications = new mongoose_1.default.Schema({
    mutedCommunityIds: {
        type: Array,
        default: [],
    },
    mutedChatIds: {
        type: Array,
        default: [],
    },
    muteAll: {
        type: Boolean,
        default: false,
        required: true,
    }
}, {
    timestamps: true,
});
exports.UserNotifications = UserNotifications;
