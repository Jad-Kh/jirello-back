"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTkit = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
(dotenv_1.default).config();
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
};
const generateJWT = (user) => {
    const jwtData = prepareJWTData(user);
    return jsonwebtoken_1.default.sign(jwtData.user, jwtData.secret);
};
const generateJWTWithExpiration = (user) => {
    const jwtData = prepareJWTData(user);
    return jsonwebtoken_1.default.sign(jwtData.user, jwtData.secret, { expiresIn: '10m' });
};
exports.JWTkit = {
    generateJWT,
    generateJWTWithExpiration
};
