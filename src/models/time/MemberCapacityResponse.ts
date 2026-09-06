import type { IMemberCapacity } from "../../database/models/time/IMemberCapacity.js";
import { APISignature } from "../api/APISignature.js";

export class MemberCapacityResponse extends APISignature {
    communityId: string;
    userId: string;
    timezone: string;
    weeklyMinutes: number;
    workingDays: number[];
    dailyMinutes: number;
    overrides: IMemberCapacity["overrides"];

    constructor(values: IMemberCapacity) {
        super(values);
        this.communityId = values.communityId;
        this.userId = values.userId;
        this.timezone = values.timezone;
        this.weeklyMinutes = values.weeklyMinutes;
        this.workingDays = values.workingDays;
        this.dailyMinutes = values.dailyMinutes;
        this.overrides = values.overrides;
    }
}
