import { APISignature } from "../api/APISignature.ts";

export class PermissionsResponse extends APISignature {
    tasks: string[];
    taskGroups: string[];
    meetings: string[];
    projects: string[];
    screens: string[];
    roles: string[];

    constructor(values: PermissionsResponse) {
        super(values);
        this.tasks = values?.tasks;
        this.taskGroups = values?.taskGroups;
        this.meetings = values?.meetings;
        this.projects = values?.projects;
        this.screens = values?.screens;
        this.roles = values?.roles;
    }
}