import { describe, expect, it } from "vitest";
import { parseScaleSeedOptions, profileTotals, scaleProfiles } from "../src/scripts/seedScale/config.js";
import { createIdentityFactory } from "../src/scripts/seedScale/identities.js";
import { createRandom } from "../src/scripts/seedScale/random.js";

describe("scale seed tooling", () => {
    it("reports the intended large-profile record totals", () => {
        expect(profileTotals(scaleProfiles.large)).toEqual({
            communities: 20,
            users: 10_000,
            projects: 1_000,
            tasks: 250_000,
            messages: 1_000_000,
            notifications: 1_500_000,
            timeEntries: 500_000,
            calendarEvents: 50_000,
            deliverables: 10_000,
            portalComments: 50_000,
        });
    });

    it("parses deterministic CLI options and creates a stable run identity", () => {
        const options = parseScaleSeedOptions([
            "--profile=tiny",
            "--seed=course-demo",
            "--anchor=2026-09-03",
            "--batch-size=500",
            "--reset",
        ]);

        expect(options.runId).toBe("scale-tiny-course-demo");
        expect(options.anchor.toISOString()).toBe("2026-09-03T12:00:00.000Z");
        expect(options.batchSize).toBe(500);
        expect(options.reset).toBe(true);
    });

    it("generates repeatable random values and domain-specific ObjectIds", () => {
        const left = createRandom("repeatable");
        const right = createRandom("repeatable");
        expect([left.next(), left.next(), left.next()]).toEqual([right.next(), right.next(), right.next()]);

        const identities = createIdentityFactory("scale-tiny-repeatable");
        expect(identities("user", 42).toString()).toBe(identities("user", 42).toString());
        expect(identities("user", 42).toString()).not.toBe(identities("task", 42).toString());
    });

    it("rejects unsafe profile and batch-size input", () => {
        expect(() => parseScaleSeedOptions(["--profile=impossible"])).toThrow("Unknown seed profile");
        expect(() => parseScaleSeedOptions(["--profile=tiny", "--batch-size=2"])).toThrow(
            "between 100 and 10000",
        );
    });
});
