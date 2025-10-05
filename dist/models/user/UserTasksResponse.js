"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTasksResponse = void 0;
const APISignature_ts_1 = require("../api/APISignature.ts");
class UserTasksResponse extends APISignature_ts_1.APISignature {
    taskIds;
    taskGroupIds;
    taskPerWeekAverage;
    constructor(values) {
        super(values);
        this.taskIds = values.taskIds;
        this.taskGroupIds = values.taskGroupIds;
        this.taskPerWeekAverage = values.taskPerWeekAverage;
    }
}
exports.UserTasksResponse = UserTasksResponse;
