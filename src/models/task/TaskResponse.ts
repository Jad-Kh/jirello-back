import type { ITask } from "../../database/models/task/ITask.js";
import { APISignature } from "../api/APISignature.js";

export class TaskResponse extends APISignature {
    title: string;
    description?: string;
    priority: string;
    deadline: string;
    deadlineAt?: Date;
    accomplished: boolean;
    projectId: string;
    status: string;
    position: number;
    version: number;
    users: ITask["users"];
    typeKey: string;
    customFields: ITask["customFields"];
    parentId?: string;
    dependencyIds: string[];
    relatedTaskIds: string[];
    tags: string[];
    startAt?: Date;
    estimatedMinutes?: number;
    milestone: boolean;
    recurrence?: ITask["recurrence"];
    audience: ITask["audience"];

    constructor(values: ITask & { _id?: { toString(): string } | string }) {
        super(values);
        this.title = values.title;
        this.description = values.description;
        this.priority = values.priority;
        this.deadline = values.deadline;
        this.deadlineAt = values.deadlineAt;
        this.accomplished = values.accomplished;
        this.projectId = values.projectId;
        this.status = values.status;
        this.position = values.position;
        this.version = values.version;
        this.users = values.users;
        this.typeKey = values.typeKey;
        this.customFields = values.customFields;
        this.parentId = values.parentId;
        this.dependencyIds = values.dependencyIds ?? [];
        this.relatedTaskIds = values.relatedTaskIds ?? [];
        this.tags = values.tags ?? [];
        this.startAt = values.startAt;
        this.estimatedMinutes = values.estimatedMinutes;
        this.milestone = values.milestone;
        this.recurrence = values.recurrence;
        this.audience = values.audience;
    }
}
