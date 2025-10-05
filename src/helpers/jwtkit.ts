import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import { IUser } from "../database/models/user/IUser.js";

(dotenv).config();

const prepareJWTPayload = (user: IUser) => {
    return {
        user: {
            id: user.id,
        },
    };
};

const prepareJWTData = (user: IUser) => {
    const jwtSecret = process.env.JWT_SECRET;
    return { user: prepareJWTPayload(user), secret: jwtSecret };
}

const generateJWT = (user: IUser) => {
    const jwtData = prepareJWTData(user);
    return jwt.sign(jwtData.user, jwtData?.secret);
};

const generateJWTWithExpiration = (user: IUser) => {
    const jwtData = prepareJWTData(user);
    return jwt.sign(jwtData.user, jwtData?.secret, { expiresIn: '10m' });
}

export const JWTkit = {
    generateJWT,
    generateJWTWithExpiration
};
