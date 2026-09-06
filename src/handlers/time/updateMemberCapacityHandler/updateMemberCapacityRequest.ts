import { memberCapacityValidationScheme } from "../../../services/time/timeService.js";

export type UpdateMemberCapacityRequest = ReturnType<typeof memberCapacityValidationScheme.validate>["value"];
