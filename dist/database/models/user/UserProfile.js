"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserProfile = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        min: 2,
        max: 30,
    },
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 25,
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 25,
    },
    birthday: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min: 8,
    }
}, {
    timestamps: true,
});
exports.UserProfile = UserProfile;
