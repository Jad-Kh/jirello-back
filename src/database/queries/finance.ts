import type { QueryFilter, QueryOptions, UpdateQuery } from "mongoose";
import type { IProjectFinance } from "../models/finance/IProjectFinance.js";
import { ProjectFinanceModel } from "../models/finance/ProjectFinance.js";

const getProjectFinanceQuery = (filter: QueryFilter<IProjectFinance>) => ProjectFinanceModel.findOne(filter);
const updateProjectFinanceQuery = (
    filter: QueryFilter<IProjectFinance>,
    update: UpdateQuery<IProjectFinance>,
    options?: QueryOptions<IProjectFinance>,
) => ProjectFinanceModel.findOneAndUpdate(filter, update, options);

export const ProjectFinanceQueries = {
    getProjectFinanceQuery,
    updateProjectFinanceQuery,
};
