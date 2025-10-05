"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityPermissions = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const permissions_1 = require("../../../helpers/permissions");
const CommunityPermissions = new mongoose_1.default.Schema({
    tasks: {
        type: Array,
        default: [permissions_1.Permissions.READ_OWN],
        required: true,
    },
    taskGroups: {
        type: Array,
        default: [permissions_1.Permissions.READ_OWN],
        required: true,
    },
    meetings: {
        type: Array,
        default: [permissions_1.Permissions.READ_OWN],
        required: true,
    },
    projects: {
        type: Array,
        default: [permissions_1.Permissions.READ_OWN],
        required: true,
    },
    screens: {
        type: Array,
        default: [permissions_1.Permissions.READ_OWN],
        required: true,
    },
    roles: {
        type: Array,
        default: [permissions_1.Permissions.READ_OWN],
        required: true,
    }
}, {
    timestamps: true,
});
exports.CommunityPermissions = CommunityPermissions;
