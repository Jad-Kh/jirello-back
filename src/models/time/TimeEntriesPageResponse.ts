import type { ITimeEntry } from "../../database/models/time/ITimeEntry.js";
import { TimeEntryResponse } from "./TimeEntryResponse.js";

type TimeEntriesPage = {
    entries: ITimeEntry[];
    nextCursor: string | null;
    total: number;
};

export class TimeEntriesPageResponse {
    entries: TimeEntryResponse[];
    nextCursor: string | null;
    total: number;

    constructor(values: TimeEntriesPage) {
        this.entries = values.entries.map((entry) => new TimeEntryResponse(entry));
        this.nextCursor = values.nextCursor;
        this.total = values.total;
    }
}
