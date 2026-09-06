import { reportMessageValidationScheme } from "../../../services/collaboration/collaborationService.js";

export type ReportMessageRequest = ReturnType<typeof reportMessageValidationScheme.validate>["value"];
