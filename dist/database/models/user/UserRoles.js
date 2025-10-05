"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoles = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserRoles = new mongoose_1.default.Schema({
    priorityRoleId: {
        type: Number,
        default: 1,
        required: true,
    },
    roleIds: {
        type: Array,
        default: [1],
        required: true,
    }
}, {
    timestamps: true,
});
exports.UserRoles = UserRoles;
