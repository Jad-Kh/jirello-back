import { createMessageValidationScheme } from "../../../services/collaboration/collaborationService.js";

export type CreateMessageRequest = ReturnType<typeof createMessageValidationScheme.validate>["value"];
