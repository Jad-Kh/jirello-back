import { ICommon } from "../ICommon.ts";
import { ITaskGroupUsers } from "./ITaskGroupUsers.ts";

export type ITaskGroup = ICommon & {
    title: string;
    accomplished: boolean;
    projectId: string;
    users: ITaskGroupUsers[]
}