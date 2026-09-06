import { createHash } from "node:crypto";
import mongoose from "mongoose";

export function createIdentityFactory(runId: string) {
    const prefixes = new Map<string, string>();

    return (domain: string, index: number) => {
        if (index < 0 || index > 0xffffff) {
            throw new Error(`Identity index outside ObjectId counter range for ${domain}.`);
        }
        let prefix = prefixes.get(domain);
        if (!prefix) {
            prefix = createHash("sha256").update(`${runId}:${domain}`).digest("hex").slice(0, 18);
            prefixes.set(domain, prefix);
        }
        return new mongoose.Types.ObjectId(prefix + index.toString(16).padStart(6, "0"));
    };
}

export type IdentityFactory = ReturnType<typeof createIdentityFactory>;
