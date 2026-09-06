import type { ITask } from "../../database/models/task/ITask.js";
import { TaskResponse } from "./TaskResponse.js";

type TasksPage = {
    tasks: ITask[];
    nextCursor: string | null;
    total: number;
};

export class TasksPageResponse {
    tasks: TaskResponse[];
    nextCursor: string | null;
    total: number;

    constructor(values: TasksPage) {
        this.tasks = values.tasks.map((task) => new TaskResponse(task));
        this.nextCursor = values.nextCursor;
        this.total = values.total;
    }
}
