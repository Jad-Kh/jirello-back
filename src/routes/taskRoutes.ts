import { Router } from "express";
import { tokenSecurity } from "../security/tokenSecurity.js";
import { getProjectTasksHandler } from "../handlers/task/getProjectTasksHandler/getProjectTasksHandler.js";
import { createTaskHandler } from "../handlers/task/createTaskHandler/createTaskHandler.js";
import { reorderTasksHandler } from "../handlers/task/reorderTasksHandler/reorderTasksHandler.js";
import { updateTaskHandler } from "../handlers/task/updateTaskHandler/updateTaskHandler.js";
import { deleteTaskHandler } from "../handlers/task/deleteTaskHandler/deleteTaskHandler.js";
import {
    updateTaskValidator,
    reorderTasksValidator,
    createTaskValidator,
    getProjectTasksValidator,
} from "../validators/taskValidators.js";
import { endpointForward } from "../helpers/endpointForward.js";
import {
    createTaskPresenter,
    deleteTaskPresenter,
    getProjectTasksPresenter,
    reorderTasksPresenter,
    updateTaskPresenter,
} from "../presenters/taskPresenter.js";

const taskRoutes = Router();

taskRoutes.use(tokenSecurity);

taskRoutes.get(
    "/project/:projectId",
    getProjectTasksValidator,
    getProjectTasksHandler,
    getProjectTasksPresenter,
    endpointForward,
);

taskRoutes.post("/", createTaskValidator, createTaskHandler, createTaskPresenter, endpointForward);

taskRoutes.patch(
    "/reorder",
    reorderTasksValidator,
    reorderTasksHandler,
    reorderTasksPresenter,
    endpointForward,
);

taskRoutes.patch("/:id", updateTaskValidator, updateTaskHandler, updateTaskPresenter, endpointForward);

taskRoutes.delete("/:id", deleteTaskHandler, deleteTaskPresenter, endpointForward);

export { taskRoutes };
