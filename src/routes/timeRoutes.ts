import { Router } from "express";
import { endpointForward } from "../helpers/endpointForward.js";
import { tokenSecurity } from "../security/tokenSecurity.js";
import { getTimeEntriesHandler } from "../handlers/time/getTimeEntriesHandler/getTimeEntriesHandler.js";
import { createTimeEntryHandler } from "../handlers/time/createTimeEntryHandler/createTimeEntryHandler.js";
import { updateTimeEntryHandler } from "../handlers/time/updateTimeEntryHandler/updateTimeEntryHandler.js";
import { submitTimesheetHandler } from "../handlers/time/submitTimesheetHandler/submitTimesheetHandler.js";
import { reviewTimeEntryHandler } from "../handlers/time/reviewTimeEntryHandler/reviewTimeEntryHandler.js";
import { getMemberCapacityHandler } from "../handlers/time/getMemberCapacityHandler/getMemberCapacityHandler.js";
import { updateMemberCapacityHandler } from "../handlers/time/updateMemberCapacityHandler/updateMemberCapacityHandler.js";
import { getWorkloadHandler } from "../handlers/time/getWorkloadHandler/getWorkloadHandler.js";
import {
    getMemberCapacityValidator,
    getTimeEntriesValidator,
    getWorkloadValidator,
    updateTimeEntryValidator,
    reviewTimeEntryValidator,
    createTimeEntryValidator,
    submitTimesheetValidator,
    updateMemberCapacityValidator,
} from "../validators/timeValidators.js";
import {
    createTimeEntryPresenter,
    getMemberCapacityPresenter,
    getTimeEntriesPresenter,
    getWorkloadPresenter,
    reviewTimeEntryPresenter,
    submitTimesheetPresenter,
    updateMemberCapacityPresenter,
    updateTimeEntryPresenter,
} from "../presenters/timePresenter.js";

const timeRoutes = Router();

timeRoutes.use(tokenSecurity);

timeRoutes.get(
    "/entries",
    getTimeEntriesValidator,
    getTimeEntriesHandler,
    getTimeEntriesPresenter,
    endpointForward,
);

timeRoutes.post(
    "/entries",
    createTimeEntryValidator,
    createTimeEntryHandler,
    createTimeEntryPresenter,
    endpointForward,
);

timeRoutes.patch(
    "/entries/:id",
    updateTimeEntryValidator,
    updateTimeEntryHandler,
    updateTimeEntryPresenter,
    endpointForward,
);

timeRoutes.post(
    "/timesheets/submit",
    submitTimesheetValidator,
    submitTimesheetHandler,
    submitTimesheetPresenter,
    endpointForward,
);

timeRoutes.post(
    "/entries/:id/review",
    reviewTimeEntryValidator,
    reviewTimeEntryHandler,
    reviewTimeEntryPresenter,
    endpointForward,
);

timeRoutes.get(
    "/capacity",
    getMemberCapacityValidator,
    getMemberCapacityHandler,
    getMemberCapacityPresenter,
    endpointForward,
);

timeRoutes.put(
    "/capacity/:userId",
    updateMemberCapacityValidator,
    updateMemberCapacityHandler,
    updateMemberCapacityPresenter,
    endpointForward,
);

timeRoutes.get("/workload", getWorkloadValidator, getWorkloadHandler, getWorkloadPresenter, endpointForward);

export { timeRoutes };
