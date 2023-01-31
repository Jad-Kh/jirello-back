import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

(dotenv).config();

const prepareJWTPayload = (user) => {
    return {
        user: {
            id: user.id,
            role: user.role,
        },
    };
};

const generateJWT = (user) => {
    const JWT_SECRET = process.env.JWT_SECRET || "200_JORGANIZE_RANDOM_200";
    const jwtData = prepareJWTPayload(user);
    const jsonToken = jwt.sign(jwtData, JWT_SECRET);
    return jsonToken;
};

const jwtUserEncryption = (user) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const payload = { user };
    const token = jwt.sign(payload, JWT_SECRET);
    return token;
};

export {
    generateJWT,
    jwtUserEncryption,
};
