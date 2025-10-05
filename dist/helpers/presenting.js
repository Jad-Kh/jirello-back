"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPresenter = void 0;
const successResponsePresenter_js_1 = require("../presenters/common/successResponsePresenter.js");
const createPresenter = (successResponse, ResponseModelClass = null, dataKey = null, setResStatus = false) => {
    return async (req, res, next) => {
        const reqAsAny = req;
        const rawData = dataKey ? reqAsAny[dataKey] : reqAsAny.responseModel || {};
        const responseModel = ResponseModelClass
            ? new ResponseModelClass(rawData)
            : rawData;
        const code = successResponse.code;
        if (setResStatus) {
            res.statusCode = code;
        }
        else {
            reqAsAny.statusCode = code;
        }
        reqAsAny.presenterModel = (0, successResponsePresenter_js_1.prepareSuccessResponse)(successResponse, null, responseModel);
        return next();
    };
};
exports.createPresenter = createPresenter;
