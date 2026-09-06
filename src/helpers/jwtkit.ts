import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { getEnvironment } from "../startup/environment.js";

export type TokenType = "access" | "refresh";

export type AuthTokenPayload = JwtPayload & {
    sub: string;
    type: TokenType;
};

type UserIdentity = string | { id?: string; _id?: { toString(): string } | string };

function getUserId(user: UserIdentity): string {
    if (typeof user === "string") return user;
    const id = user.id ?? user._id?.toString();
    if (!id) throw new Error("Cannot create a token without a user ID.");
    return id;
}

function signToken(user: UserIdentity, type: TokenType): string {
    const environment = getEnvironment();
    const secret = type === "access" ? environment.accessTokenSecret : environment.refreshTokenSecret;
    const expiresIn = (
        type === "access" ? environment.accessTokenTtl : environment.refreshTokenTtl
    ) as SignOptions["expiresIn"];

    return jwt.sign({ type }, secret, {
        subject: getUserId(user),
        expiresIn,
        algorithm: "HS256",
        jwtid: randomUUID(),
    });
}

function verifyToken(token: string, type: TokenType): AuthTokenPayload {
    const environment = getEnvironment();
    const secret = type === "access" ? environment.accessTokenSecret : environment.refreshTokenSecret;
    const payload = jwt.verify(token, secret, { algorithms: ["HS256"] });

    if (typeof payload === "string" || payload.type !== type || !payload.sub) {
        throw new Error(`Invalid ${type} token.`);
    }

    return payload as AuthTokenPayload;
}

function hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
}

function tokenMatchesHash(token: string, expectedHash: string): boolean {
    const actual = Buffer.from(hashToken(token));
    const expected = Buffer.from(expectedHash);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
}

const generateRefreshToken = (user: UserIdentity) => signToken(user, "refresh");

const generateAccessToken = (user: UserIdentity) => signToken(user, "access");

export const JWTkit = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken: (token: string) => verifyToken(token, "access"),
    verifyRefreshToken: (token: string) => verifyToken(token, "refresh"),
    hashToken,
    tokenMatchesHash,
    // Compatibility aliases while legacy handlers are migrated.
    generateJWT: generateRefreshToken,
    generateJWTWithExpiration: generateAccessToken,
};
