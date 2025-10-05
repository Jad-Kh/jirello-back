"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidator = void 0;
const errorLogging_js_1 = require("./errorLogging.js");
const CommonErrorResponses_ts_1 = require("../responses/errors/CommonErrorResponses.ts");
const errorResponsePresenter_ts_1 = require("../presenters/common/errorResponsePresenter.ts");
const createValidator = (validationScheme, errorResponse, hasId = false) => async (req, res, next) => {
    try {
        if (hasId && !req.params.id) {
            return (0, errorLogging_js_1.handleError)(res, CommonErrorResponses_ts_1.CommonErrorResponses.NOT_FOUND, "", exports.createValidator, false);
        }
        const dataToValidate = { ...req.body, ...(hasId ? { id: req.params.id } : {}) };
        const { error, value } = validationScheme.validate(dataToValidate);
        if (error) {
            return res.status(errorResponse.code).json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(errorResponse, error?.message));
        }
        req.requestModel = value;
        return next();
    }
    catch (err) {
        return (0, errorLogging_js_1.handleError)(res, CommonErrorResponses_ts_1.CommonErrorResponses.SERVER_ERROR, "", exports.createValidator, true);
    }
};
exports.createValidator = createValidator;
