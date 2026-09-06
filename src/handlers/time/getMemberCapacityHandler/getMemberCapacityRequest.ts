import { getMemberCapacityValidationScheme } from "../../../validators/schemes/timeValidationSchemes.js";

export type GetMemberCapacityRequest = ReturnType<typeof getMemberCapacityValidationScheme.validate>["value"];
