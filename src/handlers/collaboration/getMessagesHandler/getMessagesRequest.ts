import { getMessagesValidationScheme } from "../../../validators/schemes/collaborationValidationSchemes.js";

export type GetMessagesRequest = ReturnType<typeof getMessagesValidationScheme.validate>["value"];
