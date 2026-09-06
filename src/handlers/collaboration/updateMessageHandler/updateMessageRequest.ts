import { updateMessageValidationScheme } from "../../../services/collaboration/collaborationService.js";

export type UpdateMessageRequest = ReturnType<typeof updateMessageValidationScheme.validate>["value"];
