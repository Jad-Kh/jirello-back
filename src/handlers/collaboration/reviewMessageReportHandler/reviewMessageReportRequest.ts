import { reviewMessageReportValidationScheme } from "../../../services/collaboration/collaborationService.js";

export type ReviewMessageReportRequest = ReturnType<
    typeof reviewMessageReportValidationScheme.validate
>["value"];
