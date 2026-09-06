import { createClientCommentValidationScheme } from "../../../validators/schemes/portalValidationSchemes.js";

export type CreateClientCommentRequest = ReturnType<
    typeof createClientCommentValidationScheme.validate
>["value"];
