import { grantGuestAccessValidationScheme } from "../../../validators/schemes/portalValidationSchemes.js";

export type GrantGuestAccessRequest = ReturnType<typeof grantGuestAccessValidationScheme.validate>["value"];
