import { describe, expect, it } from "vitest";
import { JWTkit } from "../src/helpers/jwtkit.js";

describe("JWTkit", () => {
    it("creates and verifies typed access and refresh tokens", () => {
        const accessToken = JWTkit.generateAccessToken("507f1f77bcf86cd799439011");
        const refreshToken = JWTkit.generateRefreshToken("507f1f77bcf86cd799439011");

        expect(JWTkit.verifyAccessToken(accessToken)).toMatchObject({
            sub: "507f1f77bcf86cd799439011",
            type: "access",
        });
        expect(JWTkit.verifyRefreshToken(refreshToken)).toMatchObject({ type: "refresh" });
        expect(() => JWTkit.verifyAccessToken(refreshToken)).toThrow();
    });

    it("rotates tokens and compares only their hashes", () => {
        const first = JWTkit.generateRefreshToken("507f1f77bcf86cd799439011");
        const second = JWTkit.generateRefreshToken("507f1f77bcf86cd799439011");
        const hash = JWTkit.hashToken(first);

        expect(first).not.toBe(second);
        expect(hash).toHaveLength(64);
        expect(JWTkit.tokenMatchesHash(first, hash)).toBe(true);
        expect(JWTkit.tokenMatchesHash(second, hash)).toBe(false);
    });

    it("does not create a token without an identity", () => {
        expect(() => JWTkit.generateAccessToken({})).toThrow("without a user ID");
    });
});
