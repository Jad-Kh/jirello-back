import { catchError } from "../../../helpers/errorLogging";
import { NextFunction } from "express";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { SignUpRequest } from "./signUpRequest.js";
import { UserQueries } from "../../../database/queries/user.js";
import { checkSecurity } from "../../../helpers/security.js";
import { signUpSecurity } from "./signUpSecurity.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { UserResponse } from "../../../models/user/UserResponse.js";
import { signUpMapper } from "./signUpMapper.js";
import { JWTkit } from "../../../helpers/jwtkit.js";

export const signUpHandler = async(req: IRequest<SignUpRequest, "user">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const userByEmail = await UserQueries.getUserByEmailQuery(requestModel?.email as string) as IUser;
        const userByUsername = await UserQueries.getUserByUsernameQuery(requestModel?.username as string) as IUser;
        if(checkSecurity(signUpSecurity(res, userByEmail, userByUsername))) {
            const mappedUser = await signUpMapper(requestModel as SignUpRequest);
            const newUser = new UserResponse(mappedUser);
            const savedUser = await UserQueries.createUserQuery(newUser as IUser);
            const refreshToken = JWTkit.generateJWT(savedUser);
            const accessToken = JWTkit.generateJWTWithExpiration(savedUser);
            req.user = { savedUser, refreshToken, accessToken };
            return next();
        }
    } catch(error) {
        catchError(error as Error, res, signUpHandler.name);
    }
}