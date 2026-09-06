import { submitTimesheetValidationScheme } from "../../../validators/schemes/timeValidationSchemes.js";

export type SubmitTimesheetRequest = ReturnType<typeof submitTimesheetValidationScheme.validate>["value"];
