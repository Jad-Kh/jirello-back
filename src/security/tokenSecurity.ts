import { IRequest, IResponse } from "../helpers/api.ts";
import { NextFunction } from "express";
import { CommonErrorResponses } from "../responses/errors/CommonErrorResponses.ts";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.ts";
import jwt from "jsonwebtoken";
import { UserQueries } from "../database/queries/user.ts";
import { prepareErrorLog } from "../errorLog/errorLog.ts";

const tokenSecurity = async (req: IRequest<any, "user">, res: IResponse, next: NextFunction) => {
    try {
        const token = req.header("Authorization");
        if(!token) {
            return res.status(CommonErrorResponses.UNAUTHORIZED.code)
                .json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
        }
        // @ts-ignore
        const data = jwt.decode(token.replace("Bearer", "").trim(), process.env.JWT_SECRET);
        if(data) {
            const user = await UserQueries.getUserByIdQuery(data?.user.id);
            if(!user) {
                return res.status(CommonErrorResponses.UNAUTHORIZED.code)
                    .json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
            }
            // @ts-ignore
            jwt.verify(token.replace("Bearer", "").trim(), process.env.JWT_SECRET, (error, user) => {
                if(error) {
                    return res.status(CommonErrorResponses.FORBIDDEN.code)
                        .json(prepareErrorResponse(CommonErrorResponses.FORBIDDEN, null));
                } else {
                    req.user = user;
                    return next();
                }
            });
        } else {
            return res.status(CommonErrorResponses.UNAUTHORIZED.code)
                .json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
        }
    } catch(error) {
        prepareErrorLog(error, tokenSecurity.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};