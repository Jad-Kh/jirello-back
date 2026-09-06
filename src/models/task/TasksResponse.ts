import type { ITask } from "../../database/models/task/ITask.js";
import { TaskResponse } from "./TaskResponse.js";

export class TasksResponse extends Array<TaskResponse> {
    constructor(values: ITask[]) {
        super(...values.map((task) => new TaskResponse(task)));
    }
}
