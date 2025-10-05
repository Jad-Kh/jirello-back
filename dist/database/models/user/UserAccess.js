"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccess = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserAccess = new mongoose_1.default.Schema({
    refreshToken: {
        type: String,
        default: '',
    }
}, {
    timestamps: true,
});
exports.UserAccess = UserAccess;
