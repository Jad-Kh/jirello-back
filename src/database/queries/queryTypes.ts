import type { ClientSession, QueryOptions } from "mongoose";

export type DocumentQueryOptions<T> = Omit<QueryOptions<T>, "includeResultMetadata"> & {
    includeResultMetadata?: false;
};

export type SessionWriteOptions = {
    session?: ClientSession;
};
