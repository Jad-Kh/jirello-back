import { APISignature } from "../api/APISignature.ts";

export class UserTasksResponse extends APISignature {
    taskIds: string[];
    taskGroupIds: string[];
    taskPerWeekAverage: number;

    constructor(values: UserTasksResponse) {
        super(values);
        this.taskIds = values.taskIds;
        this.taskGroupIds = values.taskGroupIds;
        this.taskPerWeekAverage = values.taskPerWeekAverage;
    }
}