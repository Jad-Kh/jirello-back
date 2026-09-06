import { describe, expect, it } from "vitest";
import { isEmpty } from "../src/helpers/isEmpty.js";
import {
    decodeDateCursor,
    decodePositionCursor,
    encodeDateCursor,
    encodePositionCursor,
} from "../src/helpers/cursorPagination.js";
import { preparePagination } from "../src/helpers/pagination.js";
import { checkSecurity } from "../src/helpers/security.js";

describe("common helpers", () => {
    it("identifies empty values without treating primitives as empty", () => {
        expect(isEmpty(null)).toBe(true);
        expect(isEmpty({})).toBe(true);
        expect(isEmpty([])).toBe(true);
        expect(isEmpty({ id: 1 })).toBe(false);
        expect(isEmpty(false)).toBe(false);
    });

    it("bounds pagination and applies defaults", () => {
        expect(preparePagination({})).toEqual({ skip: 0, limit: 10 });
        expect(preparePagination({ page: "3", limit: "500" })).toEqual({ skip: 200, limit: 100 });
        expect(preparePagination({ page: "bad", limit: "bad" })).toEqual({ skip: 0, limit: 10 });
    });

    it("round-trips stable date and ID cursors and rejects malformed cursors", () => {
        const encoded = encodeDateCursor(new Date("2026-08-27T09:00:00.000Z"), "507f1f77bcf86cd799439011");
        expect(decodeDateCursor(encoded)).toEqual({
            createdAt: "2026-08-27T09:00:00.000Z",
            id: "507f1f77bcf86cd799439011",
        });
        expect(decodeDateCursor("not-a-cursor")).toBeNull();
    });

    it("round-trips task position cursors and rejects incomplete values", () => {
        const encoded = encodePositionCursor(42.5, "507f1f77bcf86cd799439011");

        expect(decodePositionCursor(encoded)).toEqual({
            position: 42.5,
            id: "507f1f77bcf86cd799439011",
        });
        expect(
            decodePositionCursor(
                Buffer.from(JSON.stringify({ position: "42", id: "507f1f77bcf86cd799439011" })).toString(
                    "base64url",
                ),
            ),
        ).toBeNull();
    });

    it("continues only when a security check explicitly succeeds", () => {
        expect(checkSecurity(true)).toBe(true);
        expect(checkSecurity({} as any)).toBe(false);
    });
});
