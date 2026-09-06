import type { ICalendar } from "../../database/models/calendar/ICalendar.js";
import { CalendarResponse } from "./CalendarResponse.js";

export class CalendarsResponse extends Array<CalendarResponse> {
    constructor(values: ICalendar[]) {
        super(...values.map((calendar) => new CalendarResponse(calendar)));
    }
}
