import { createPresenter } from "../helpers/presenting.js";
import { LearningSuccessResponses } from "../responses/success/LearningSuccessResponses.js";

export const runTransactionPresenter = createPresenter(LearningSuccessResponses.DEFAULT);
export const createOrderPresenter = createPresenter(LearningSuccessResponses.ORDER_CREATED);
export const seedOrdersPresenter = createPresenter(LearningSuccessResponses.DEFAULT);
export const explainOrderIndexPresenter = createPresenter(LearningSuccessResponses.MONGODB_QUERY_PLAN_LOADED);
export const getOrdersPresenter = createPresenter(
    LearningSuccessResponses.CURSOR_PAGE_LOADED_WITH_AN_INDEXED_RANGE_QUERY,
);
export const getOrderPresenter = createPresenter(LearningSuccessResponses.ORDER_LOADED_FROM_REDIS);
export const updateOrderPresenter = createPresenter(
    LearningSuccessResponses.ATOMIC_VERSION_CHECK_UPDATE_SUCCEEDED_REDIS_CACHE_INVALIDATED,
);
export const getLearningJobPresenter = createPresenter(LearningSuccessResponses.BACKGROUND_JOB_STATUS_LOADED);
export const runCpuWorkPresenter = createPresenter(LearningSuccessResponses.DEFAULT);
