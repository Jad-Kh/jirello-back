"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanUpModel = void 0;
const cleanUpModel = (model) => {
    const modelJSONString = JSON.stringify(model);
    return JSON.parse(modelJSONString, (key, value) => {
        if (value !== null)
            return value;
    });
};
exports.cleanUpModel = cleanUpModel;
