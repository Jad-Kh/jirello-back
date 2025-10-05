"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFalsyKeys = exports.cleanUpModel = void 0;
const cleanUpModel = (model) => {
    const modelJSONString = JSON.stringify(model);
    return JSON.parse(modelJSONString, (key, value) => {
        if (value !== null)
            return value;
    });
};
exports.cleanUpModel = cleanUpModel;
const removeFalsyKeys = (model) => {
    let newObj = {};
    Object.keys(model).forEach((prop) => {
        if (model[prop]) {
            newObj[prop] = model[prop];
        }
    });
    return newObj;
};
exports.removeFalsyKeys = removeFalsyKeys;
