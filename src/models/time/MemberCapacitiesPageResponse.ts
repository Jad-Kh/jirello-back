import type { IMemberCapacity } from "../../database/models/time/IMemberCapacity.js";
import { MemberCapacityResponse } from "./MemberCapacityResponse.js";

type MemberCapacitiesPage = {
    capacity: IMemberCapacity[];
    nextCursor: string | null;
    total: number;
};

export class MemberCapacitiesPageResponse {
    capacity: MemberCapacityResponse[];
    nextCursor: string | null;
    total: number;

    constructor(values: MemberCapacitiesPage) {
        this.capacity = values.capacity.map((item) => new MemberCapacityResponse(item));
        this.nextCursor = values.nextCursor;
        this.total = values.total;
    }
}
