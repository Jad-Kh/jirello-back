class CommunityPermissionsRequestModel {
    tasks = undefined;
    taskGroups = undefined;
    meetings = undefined;
    projects = undefined;
    screens = undefined;
    roles = undefined;

    constructor(values) {
        this.tasks = values.tasks;
        this.taskGroups = values.taskGroups;
        this.meetings = values.meetings;
        this.projects = values.projects;
        this.screens = values.screens;
        this.roles = values.roles;
    }
}

export {
    CommunityPermissionsRequestModel
}