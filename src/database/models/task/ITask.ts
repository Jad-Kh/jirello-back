import { ICommon } from "../ICommon.js";
import { ITaskUsers } from "./ITaskUsers.js";

export type ITask = ICommon & {
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
    users: ITaskUsers;
    typeKey: string;
    customFields: Map<string, unknown> | Record<string, unknown>;
    parentId?: string;
    dependencyIds: string[];
    relatedTaskIds: string[];
    tags: string[];
    startAt?: Date;
    estimatedMinutes?: number;
    milestone: boolean;
    recurrence?: {
        frequency: "daily" | "weekly" | "monthly";
        interval: number;
        until?: Date;
    };
    recurrenceGeneratedAt?: Date;
    audience: "internal" | "client";
    idempotencyKey?: string;
    requestHash?: string;
};
