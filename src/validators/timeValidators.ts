import type { GetTimeEntriesRequest } from "../handlers/time/getTimeEntriesHandler/getTimeEntriesRequest.js";
import type { CreateTimeEntryRequest } from "../handlers/time/createTimeEntryHandler/createTimeEntryRequest.js";
import type { UpdateTimeEntryRequest } from "../handlers/time/updateTimeEntryHandler/updateTimeEntryRequest.js";
import type { SubmitTimesheetRequest } from "../handlers/time/submitTimesheetHandler/submitTimesheetRequest.js";
import type { ReviewTimeEntryRequest } from "../handlers/time/reviewTimeEntryHandler/reviewTimeEntryRequest.js";
import type { GetMemberCapacityRequest } from "../handlers/time/getMemberCapacityHandler/getMemberCapacityRequest.js";
import type { UpdateMemberCapacityRequest } from "../handlers/time/updateMemberCapacityHandler/updateMemberCapacityRequest.js";
import type { GetWorkloadRequest } from "../handlers/time/getWorkloadHandler/getWorkloadRequest.js";
import { createValidator } from "../helpers/validator.js";
import { TimeErrorResponses } from "../responses/errors/TimeErrorResponses.js";
import {
    getMemberCapacityValidationScheme,
    getTimeEntriesValidationScheme,
    getWorkloadValidationScheme,
    reviewTimeEntryValidationScheme,
    updateTimeEntryValidationScheme,
    timeEntryValidationScheme,
    submitTimesheetValidationScheme,
    memberCapacityValidationScheme,
} from "./schemes/timeValidationSchemes.js";

export const updateTimeEntryValidator = createValidator<UpdateTimeEntryRequest>(
    updateTimeEntryValidationScheme,
    TimeErrorResponses.VALIDATION_ERROR,
);

export const getMemberCapacityValidator = createValidator<GetMemberCapacityRequest>(
    getMemberCapacityValidationScheme,
    TimeErrorResponses.VALIDATION_ERROR,
);

export const getTimeEntriesValidator = createValidator<GetTimeEntriesRequest>(
    getTimeEntriesValidationScheme,
    TimeErrorResponses.VALIDATION_ERROR,
);

export const getWorkloadValidator = createValidator<GetWorkloadRequest>(
    getWorkloadValidationScheme,
    TimeErrorResponses.VALIDATION_ERROR,
);

export const reviewTimeEntryValidator = createValidator<ReviewTimeEntryRequest>(
    reviewTimeEntryValidationScheme,
    TimeErrorResponses.VALIDATION_ERROR,
);

export const createTimeEntryValidator = createValidator<CreateTimeEntryRequest>(
    timeEntryValidationScheme,
    TimeErrorResponses.VALIDATION_ERROR,
);

export const submitTimesheetValidator = createValidator<SubmitTimesheetRequest>(
    submitTimesheetValidationScheme,
    TimeErrorResponses.VALIDATION_ERROR,
);

export const updateMemberCapacityValidator = createValidator<UpdateMemberCapacityRequest>(
    memberCapacityValidationScheme,
    TimeErrorResponses.VALIDATION_ERROR,
);
