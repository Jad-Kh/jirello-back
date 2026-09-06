import { getProjectTasksValidationScheme } from "../../../validators/schemes/taskValidationSchemes.js";

export type GetProjectTasksRequest = ReturnType<typeof getProjectTasksValidationScheme.validate>["value"];
