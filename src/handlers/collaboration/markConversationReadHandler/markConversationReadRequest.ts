import { collaborationScopeValidationScheme } from "../../../services/collaboration/collaborationService.js";

export type MarkConversationReadRequest = ReturnType<
    typeof collaborationScopeValidationScheme.validate
>["value"];
