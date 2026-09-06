import { Router } from "express";
import { endpointForward } from "../helpers/endpointForward.js";
import { tokenSecurity } from "../security/tokenSecurity.js";
import { runTransactionHandler } from "../handlers/learning/runTransactionHandler/runTransactionHandler.js";
import { createOrderHandler } from "../handlers/learning/createOrderHandler/createOrderHandler.js";
import { seedOrdersHandler } from "../handlers/learning/seedOrdersHandler/seedOrdersHandler.js";
import { explainOrderIndexHandler } from "../handlers/learning/explainOrderIndexHandler/explainOrderIndexHandler.js";
import { getOrdersHandler } from "../handlers/learning/getOrdersHandler/getOrdersHandler.js";
import { getOrderHandler } from "../handlers/learning/getOrderHandler/getOrderHandler.js";
import { updateOrderHandler } from "../handlers/learning/updateOrderHandler/updateOrderHandler.js";
import { getLearningJobHandler } from "../handlers/learning/getLearningJobHandler/getLearningJobHandler.js";
import { runCpuWorkHandler } from "../handlers/learning/runCpuWorkHandler/runCpuWorkHandler.js";
import {
    getOrdersValidator,
    updateOrderValidator,
    createOrderValidator,
    seedOrdersValidator,
    runTransactionValidator,
    runCpuWorkValidator,
} from "../validators/learningValidators.js";
import {
    createOrderPresenter,
    explainOrderIndexPresenter,
    getLearningJobPresenter,
    getOrderPresenter,
    getOrdersPresenter,
    runCpuWorkPresenter,
    runTransactionPresenter,
    seedOrdersPresenter,
    updateOrderPresenter,
} from "../presenters/learningPresenter.js";

const learningRoutes = Router();

learningRoutes.use(tokenSecurity);

learningRoutes.post(
    "/transaction",
    runTransactionValidator,
    runTransactionHandler,
    runTransactionPresenter,
    endpointForward,
);

learningRoutes.post(
    "/orders",
    createOrderValidator,
    createOrderHandler,
    createOrderPresenter,
    endpointForward,
);

learningRoutes.post(
    "/orders/seed",
    seedOrdersValidator,
    seedOrdersHandler,
    seedOrdersPresenter,
    endpointForward,
);

learningRoutes.get(
    "/orders/index-explain",
    explainOrderIndexHandler,
    explainOrderIndexPresenter,
    endpointForward,
);

learningRoutes.get("/orders", getOrdersValidator, getOrdersHandler, getOrdersPresenter, endpointForward);

learningRoutes.get("/orders/:id", getOrderHandler, getOrderPresenter, endpointForward);

learningRoutes.patch(
    "/orders/:id",
    updateOrderValidator,
    updateOrderHandler,
    updateOrderPresenter,
    endpointForward,
);

learningRoutes.get("/jobs/:jobId", getLearningJobHandler, getLearningJobPresenter, endpointForward);

learningRoutes.get(
    "/cpu/:mode",
    runCpuWorkValidator,
    runCpuWorkHandler,
    runCpuWorkPresenter,
    endpointForward,
);

export { learningRoutes };
