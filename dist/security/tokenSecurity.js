"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommonErrorResponses_ts_1 = require("../responses/errors/CommonErrorResponses.ts");
const errorResponsePresenter_ts_1 = require("../presenters/common/errorResponsePresenter.ts");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_ts_1 = require("../database/queries/user.ts");
const errorLog_ts_1 = require("../errorLog/errorLog.ts");
const tokenSecurity = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED.code)
                .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED, null));
        }
        // @ts-ignore
        const data = jsonwebtoken_1.default.decode(token.replace("Bearer", "").trim(), process.env.JWT_SECRET);
        if (data) {
            const user = await user_ts_1.UserQueries.getUserByIdQuery(data?.user.id);
            if (!user) {
                return res.status(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED.code)
                    .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED, null));
            }
            // @ts-ignore
            jsonwebtoken_1.default.verify(token.replace("Bearer", "").trim(), process.env.JWT_SECRET, (error, user) => {
                if (error) {
                    return res.status(CommonErrorResponses_ts_1.CommonErrorResponses.FORBIDDEN.code)
                        .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(CommonErrorResponses_ts_1.CommonErrorResponses.FORBIDDEN, null));
                }
                else {
                    req.user = user;
                    return next();
                }
            });
        }
        else {
            return res.status(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED.code)
                .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED, null));
        }
    }
    catch (error) {
        (0, errorLog_ts_1.prepareErrorLog)(error, tokenSecurity.name);
        return res.status(CommonErrorResponses_ts_1.CommonErrorResponses.SERVER_ERROR.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(CommonErrorResponses_ts_1.CommonErrorResponses.SERVER_ERROR, null));
    }
};
