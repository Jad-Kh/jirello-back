import type { ICalendar } from "../../database/models/calendar/ICalendar.js";
import { APISignature } from "../api/APISignature.js";

export class CalendarResponse extends APISignature {
    ownerId: string;
    communityId?: string;
    projectId?: string;
    name: string;
    color: string;
    timezone: string;
    visibility: ICalendar["visibility"];
    isDefault: boolean;
    archivedAt?: Date;
    version: number;

    constructor(values: ICalendar) {
        super(values);
        this.ownerId = values.ownerId;
        this.communityId = values.communityId;
        this.projectId = values.projectId;
        this.name = values.name;
        this.color = values.color;
        this.timezone = values.timezone;
        this.visibility = values.visibility;
        this.isDefault = values.isDefault;
        this.archivedAt = values.archivedAt;
        this.version = values.version;
    }
}
