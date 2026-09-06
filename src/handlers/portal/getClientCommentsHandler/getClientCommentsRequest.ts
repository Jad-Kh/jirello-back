import { getClientCommentsValidationScheme } from "../../../validators/schemes/portalValidationSchemes.js";

export type GetClientCommentsRequest = ReturnType<typeof getClientCommentsValidationScheme.validate>["value"];
