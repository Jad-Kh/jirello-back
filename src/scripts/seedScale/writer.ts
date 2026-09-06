import type { Collection, Document } from "mongodb";

export type SeedMarker = {
    runId: string;
    profile: string;
};

export async function writeGenerated(
    collection: Collection,
    count: number,
    batchSize: number,
    marker: SeedMarker,
    factory: (index: number) => Document,
) {
    let batch: Document[] = [];
    for (let index = 0; index < count; index += 1) {
        batch.push({ ...factory(index), _seed: marker });
        if (batch.length === batchSize) {
            await collection.insertMany(batch, { ordered: false });
            batch = [];
        }
    }
    if (batch.length) await collection.insertMany(batch, { ordered: false });
    return count;
}

export async function removeSeedRun(collections: Collection[], runId: string) {
    for (const collection of collections) {
        await collection.deleteMany({ "_seed.runId": runId });
    }
}
