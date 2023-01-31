class UserTasksRequestModel {
    taskIds = undefined;
    taskGroupIds = undefined;
    taskPerWeekAverage = undefined;

    constructor(values) {
        this.taskIds = values.taskIds;
        this.taskGroupIds = values.taskGroupIds;
        this.taskPerWeekAverage = values.taskPerWeekAverage;
    }
}

export {
    UserTasksRequestModel
}