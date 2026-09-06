import { createPresenter } from "../helpers/presenting.js";
import { TaskResponse } from "../models/task/TaskResponse.js";
import { TasksResponse } from "../models/task/TasksResponse.js";
import { TasksPageResponse } from "../models/task/TasksPageResponse.js";
import { TaskSuccessResponses } from "../responses/success/TaskSuccessResponses.js";

export const getProjectTasksPresenter = createPresenter(
    TaskSuccessResponses.PROJECT_TASKS_LOADED,
    TasksPageResponse,
);

export const createTaskPresenter = createPresenter(TaskSuccessResponses.TASK_CREATED, TaskResponse);

export const reorderTasksPresenter = createPresenter(TaskSuccessResponses.TASKS_REORDERED, TasksResponse);

export const updateTaskPresenter = createPresenter(TaskSuccessResponses.TASK_UPDATED, TaskResponse);

export const deleteTaskPresenter = createPresenter(TaskSuccessResponses.TASK_DELETED);
