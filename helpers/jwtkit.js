import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

(dotenv).config();

const prepareJWTPayload = (user) => {
    return {
        user: {
            id: user.id,
        },
    };
};

const prepareJWTData = (user) => {
    const jwtSecret = process.env.JWT_SECRET;
    return { user: prepareJWTPayload(user), secret: jwtSecret };
}

const generateJWT = (user) => {
    const jwtData = prepareJWTData(user);
    return jwt.sign(jwtData.user, jwtData.secret);
};

const generateJWTWithExpiration = (user) => {
    const jwtData = prepareJWTData(user);
    return jwt.sign(jwtData.user, jwtData.secret, { expiresIn: '10m' });
}

export {
    generateJWT,
    generateJWTWithExpiration
};
