"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpMapper = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const signUpMapper = async (requestModel) => {
    const isAdmin = false;
    const communityIds = [];
    const ownedCommunityIds = [];
    const taskIds = [];
    const taskGroupIds = [];
    const taskPerWeekAverage = 0;
    const tasks = { taskIds, taskGroupIds, taskPerWeekAverage };
    const mutedCommunityIds = [];
    const mutedChatIds = [];
    const muteAll = false;
    const notifications = { mutedCommunityIds, mutedChatIds, muteAll };
    const salt = await bcrypt_1.default.genSalt(10);
    const hashedPassword = await bcrypt_1.default.hash(requestModel.password, salt);
    requestModel.password = hashedPassword;
    return {
        isAdmin,
        communityIds,
        ownedCommunityIds,
        profile: requestModel,
        tasks,
        notifications
    };
};
exports.signUpMapper = signUpMapper;
