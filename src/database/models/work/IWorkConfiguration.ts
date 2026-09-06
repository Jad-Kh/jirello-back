import { ICommon } from "../ICommon.js";

export type WorkFieldType =
    "text" | "number" | "boolean" | "date" | "currency" | "select" | "multi-select" | "user";

export type IWorkConfiguration = ICommon & {
    communityId: string;
    projectId?: string;
    key: string;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    statuses: Array<{
        key: string;
        name: string;
        category: "todo" | "in-progress" | "done";
        position: number;
    }>;
    fields: Array<{
        key: string;
        label: string;
        type: WorkFieldType;
        required: boolean;
        options: string[];
        defaultValue?: unknown;
    }>;
    transitions: Array<{ from: string; to: string }>;
    isDefault: boolean;
    archivedAt?: Date;
    version: number;
};
