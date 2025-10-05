"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const ScreenModelSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        min: 2,
        max: 30,
    },
    url: {
        type: String,
        required: true,
    },
    communityId: {
        type: String,
        required: true,
        default: 0,
    },
    password: {
        type: String,
    },
    protected: {
        type: Boolean,
        default: false,
    },
    allowedUserIds: {
        type: Array,
        default: [],
        required: true,
    }
}, {
    timestamps: true,
});
ScreenModelSchema.plugin(mongoose_paginate_v2_1.default);
const ScreenModel = mongoose_1.default.model("Screen", ScreenModelSchema);
exports.ScreenModel = ScreenModel;
