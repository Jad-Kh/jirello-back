import { createPresenter } from "../helpers/presenting.js";
import { MemberCapacityResponse } from "../models/time/MemberCapacityResponse.js";
import { MemberCapacitiesPageResponse } from "../models/time/MemberCapacitiesPageResponse.js";
import { TimeEntriesPageResponse } from "../models/time/TimeEntriesPageResponse.js";
import { TimeEntryResponse } from "../models/time/TimeEntryResponse.js";
import { TimeSuccessResponses } from "../responses/success/TimeSuccessResponses.js";

export const getTimeEntriesPresenter = createPresenter(
    TimeSuccessResponses.TIME_ENTRIES_LOADED,
    TimeEntriesPageResponse,
);
export const createTimeEntryPresenter = createPresenter(TimeSuccessResponses.DEFAULT, TimeEntryResponse);
export const updateTimeEntryPresenter = createPresenter(TimeSuccessResponses.DEFAULT, TimeEntryResponse);
export const submitTimesheetPresenter = createPresenter(TimeSuccessResponses.TIMESHEET_SUBMITTED);
export const reviewTimeEntryPresenter = createPresenter(TimeSuccessResponses.DEFAULT, TimeEntryResponse);
export const getMemberCapacityPresenter = createPresenter(
    TimeSuccessResponses.MEMBER_CAPACITY_LOADED,
    MemberCapacitiesPageResponse,
);
export const updateMemberCapacityPresenter = createPresenter(
    TimeSuccessResponses.MEMBER_CAPACITY_UPDATED,
    MemberCapacityResponse,
);
export const getWorkloadPresenter = createPresenter(TimeSuccessResponses.WORKLOAD_LOADED);
