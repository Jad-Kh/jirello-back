"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpHandler = void 0;
const errorLogging_1 = require("../../../helpers/errorLogging");
const user_ts_1 = require("../../../database/queries/user.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const signUpSecurity_ts_1 = require("./signUpSecurity.ts");
const UserResponse_ts_1 = require("../../../models/user/UserResponse.ts");
const signUpMapper_ts_1 = require("./signUpMapper.ts");
const jwtkit_ts_1 = require("../../../helpers/jwtkit.ts");
const signUpHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const userByEmail = await user_ts_1.UserQueries.getUserByEmailQuery(requestModel?.email);
        const userByUsername = await user_ts_1.UserQueries.getUserByUsernameQuery(requestModel?.username);
        if ((0, security_ts_1.checkSecurity)((0, signUpSecurity_ts_1.signUpSecurity)(res, userByEmail, userByUsername))) {
            const mappedUser = await (0, signUpMapper_ts_1.signUpMapper)(requestModel);
            const newUser = new UserResponse_ts_1.UserResponse(mappedUser);
            const savedUser = await user_ts_1.UserQueries.createUserQuery(newUser);
            const refreshToken = jwtkit_ts_1.JWTkit.generateJWT(savedUser);
            const accessToken = jwtkit_ts_1.JWTkit.generateJWTWithExpiration(savedUser);
            req.user = { savedUser, refreshToken, accessToken };
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_1.catchError)(error, res, exports.signUpHandler.name);
    }
};
exports.signUpHandler = signUpHandler;
