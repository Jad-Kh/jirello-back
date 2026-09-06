import { createDeliverableValidationScheme } from "../../../validators/schemes/portalValidationSchemes.js";

export type CreateDeliverableRequest = ReturnType<typeof createDeliverableValidationScheme.validate>["value"];
