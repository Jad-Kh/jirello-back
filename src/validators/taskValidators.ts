import type { CreateTaskRequest } from "../handlers/task/createTaskHandler/createTaskRequest.js";
import type { GetProjectTasksRequest } from "../handlers/task/getProjectTasksHandler/getProjectTasksRequest.js";
import type { ReorderTasksRequest } from "../handlers/task/reorderTasksHandler/reorderTasksRequest.js";
import type { UpdateTaskRequest } from "../handlers/task/updateTaskHandler/updateTaskRequest.js";
import { createValidator } from "../helpers/validator.js";
import { TaskErrorResponses } from "../responses/errors/TaskErrorResponses.js";
import {
    updateTaskValidationScheme,
    reorderTasksValidationScheme,
    createTaskValidationScheme,
    getProjectTasksValidationScheme,
} from "./schemes/taskValidationSchemes.js";

export const getProjectTasksValidator = createValidator<GetProjectTasksRequest>(
    getProjectTasksValidationScheme,
    TaskErrorResponses.VALIDATION_ERROR,
);

export const updateTaskValidator = createValidator<UpdateTaskRequest>(
    updateTaskValidationScheme,
    TaskErrorResponses.VALIDATION_ERROR,
);

export const reorderTasksValidator = createValidator<ReorderTasksRequest>(
    reorderTasksValidationScheme,
    TaskErrorResponses.VALIDATION_ERROR,
);

export const createTaskValidator = createValidator<CreateTaskRequest>(
    createTaskValidationScheme,
    TaskErrorResponses.VALIDATION_ERROR,
);
