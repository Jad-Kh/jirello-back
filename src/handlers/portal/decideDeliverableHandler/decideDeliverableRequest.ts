import { decideDeliverableValidationScheme } from "../../../validators/schemes/portalValidationSchemes.js";

export type DecideDeliverableRequest = ReturnType<typeof decideDeliverableValidationScheme.validate>["value"];
