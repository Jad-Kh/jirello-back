import { ICommon } from "../ICommon.js";
import { ITaskGroupUsers } from "./ITaskGroupUsers.js";

export type ITaskGroup = ICommon & {
    title: string;
    accomplished: boolean;
    projectId: string;
    users: ITaskGroupUsers;
};
