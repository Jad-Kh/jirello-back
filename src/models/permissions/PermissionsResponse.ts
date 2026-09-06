import { APISignature } from "../api/APISignature.js";

export class PermissionsResponse extends APISignature {
    tasks: number[];
    taskGroups: number[];
    meetings: number[];
    projects: number[];
    screens: number[];
    roles: number[];
    users: number[];
    communities: number[];

    constructor(values: PermissionsResponse) {
        super(values);
        this.tasks = values?.tasks;
        this.taskGroups = values?.taskGroups;
        this.meetings = values?.meetings;
        this.projects = values?.projects;
        this.screens = values?.screens;
        this.roles = values?.roles;
        this.users = values?.users;
        this.communities = values?.communities;
    }
}
