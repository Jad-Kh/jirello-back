"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const MeetingModelSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    schedule: {
        type: String,
        required: true,
    },
    organizerIds: {
        type: Array,
        default: [],
        required: true,
    },
    userIds: {
        type: Array,
        default: [],
        required: true,
    },
    projectId: {
        type: String,
        default: "Not specified",
    },
}, {
    timestamps: true,
});
MeetingModelSchema.plugin(mongoose_paginate_v2_1.default);
const MeetingModel = mongoose_1.default.model("Meetings", MeetingModelSchema);
exports.MeetingModel = MeetingModel;
