import jwt from "jsonwebtoken";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";
import { prepareErrorLog } from "../errorLog/errorLog.js";
import { getUserByIdQuery } from "../database/queries/user/userQueries.js";

const tokenSecurity = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if(!token) {
            return res.status(CommonErrorResponses.UNAUTHORIZED.code)
                .json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
        } 
        const data = jwt.decode(token.replace("Bearer", "").trim(), process.env.JWT_SECRET);
        if(data) {
            const user = await getUserByIdQuery(data?.user.id);
            if(!user) {
                return res.status(CommonErrorResponses.UNAUTHORIZED.code)
                    .json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
            }
            jwt.verify(token.replace("Bearer", "").trim(), process.env.JWT_SECRET, (error, user) => {
                if(error) {
                    return res.status(CommonErrorResponses.FORBIDDEN.code)
                        .json(prepareErrorResponse(CommonErrorResponses.FORBIDDEN, null));
                } else {
                    req.user = user;
                    next();
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

export {
    tokenSecurity
}