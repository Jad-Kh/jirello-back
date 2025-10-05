"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsResponse = void 0;
const APISignature_ts_1 = require("../api/APISignature.ts");
class PermissionsResponse extends APISignature_ts_1.APISignature {
    tasks;
    taskGroups;
    meetings;
    projects;
    screens;
    roles;
    constructor(values) {
        super(values);
        this.tasks = values?.tasks;
        this.taskGroups = values?.taskGroups;
        this.meetings = values?.meetings;
        this.projects = values?.projects;
        this.screens = values?.screens;
        this.roles = values?.roles;
    }
}
exports.PermissionsResponse = PermissionsResponse;
