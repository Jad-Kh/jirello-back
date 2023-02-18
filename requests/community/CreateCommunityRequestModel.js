class CreateCommunityRequestModel {
    name = undefined;
    flag = undefined;
    canUserViewOtherTasks = undefined;
    canUserViewOtherTaskGroups = undefined;
    canUserCreateTasks = undefined;
    canUserCreateTaskGroups = undefined;
    canUserEditTasks = undefined;
    canUserSetTaskToComplete = undefined;
    canUserSetTaskToIncomplete = undefined;
    canUserEditTaskGroups = undefined;
    canUserViewOtherProjects = undefined;

    constructor(values) {
        this.name = values.name;
        this.flag = values.flag;
        this.canUserViewOtherTasks = values.canUserViewOtherTasks;
        this.canUserViewOtherTaskGroups = values.canUserViewOtherTaskGroups;
        this.canUserCreateTasks = values.canUserCreateTasks;
        this.canUserCreateTaskGroups = values.canUserCreateTaskGroups;
        this.canUserEditTasks = values.canUserEditTasks;
        this.canUserSetTaskToComplete = values.canUserSetTaskToComplete;
        this.canUserSetTaskToIncomplete = values.canUserSetTaskToIncomplete;
        this.canUserEditTaskGroups = values.canUserEditTaskGroups;
        this.canUserViewOtherProjects = values.canUserViewOtherProjects;
    }
}

export {
    CreateCommunityRequestModel
}