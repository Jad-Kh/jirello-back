import type { ITimeEntry } from "../../database/models/time/ITimeEntry.js";
import { TimeEntryResponse } from "./TimeEntryResponse.js";

export class TimeEntriesResponse extends Array<TimeEntryResponse> {
    constructor(values: ITimeEntry[]) {
        super(...values.map((entry) => new TimeEntryResponse(entry)));
    }
}
