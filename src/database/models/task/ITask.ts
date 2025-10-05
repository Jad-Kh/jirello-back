import { ICommon } from "../ICommon.ts";
import { ITaskUsers } from "./ITaskUsers.ts";

export type ITask = ICommon & {
    title: string;
    priority: string;
    deadline: string;
    accomplished: boolean;
    projectId: string;
    status: string;
    users: ITaskUsers[];
}