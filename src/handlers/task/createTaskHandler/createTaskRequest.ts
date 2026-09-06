import { createTaskValidationScheme } from "../../../validators/schemes/taskValidationSchemes.js";

export type CreateTaskRequest = ReturnType<typeof createTaskValidationScheme.validate>["value"];
