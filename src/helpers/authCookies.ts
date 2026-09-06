import { Response } from "express";
import { getEnvironment } from "../startup/environment.js";

const cookieName = "refreshToken";

export function setRefreshTokenCookie(response: Response, token: string): void {
    const environment = getEnvironment();
    response.cookie(cookieName, token, {
        httpOnly: true,
        secure: environment.nodeEnv === "production",
        sameSite: "strict",
        path: "/auth",
        maxAge: 7 * 24 * 60 * 60 * 1_000,
    });
}

export function clearRefreshTokenCookie(response: Response): void {
    const environment = getEnvironment();
    response.clearCookie(cookieName, {
        httpOnly: true,
        secure: environment.nodeEnv === "production",
        sameSite: "strict",
        path: "/auth",
    });
}

export function readRefreshToken(request: {
    cookies?: Record<string, unknown>;
    body?: unknown;
}): string | undefined {
    const cookieToken = request.cookies?.[cookieName];
    if (typeof cookieToken === "string") return cookieToken;

    if (request.body && typeof request.body === "object" && "refreshToken" in request.body) {
        const bodyToken = (request.body as { refreshToken?: unknown }).refreshToken;
        return typeof bodyToken === "string" ? bodyToken : undefined;
    }

    return undefined;
}
