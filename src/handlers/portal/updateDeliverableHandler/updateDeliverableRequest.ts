import { updateDeliverableValidationScheme } from "../../../validators/schemes/portalValidationSchemes.js";

export type UpdateDeliverableRequest = ReturnType<typeof updateDeliverableValidationScheme.validate>["value"];
