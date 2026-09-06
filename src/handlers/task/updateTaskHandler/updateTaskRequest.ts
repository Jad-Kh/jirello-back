import { updateTaskValidationScheme } from "../../../validators/schemes/taskValidationSchemes.js";

export type UpdateTaskRequest = ReturnType<typeof updateTaskValidationScheme.validate>["value"];
