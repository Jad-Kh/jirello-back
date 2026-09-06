import { reorderTasksValidationScheme } from "../../../validators/schemes/taskValidationSchemes.js";

export type ReorderTasksRequest = ReturnType<typeof reorderTasksValidationScheme.validate>["value"];
