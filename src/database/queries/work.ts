import type { AnyKeys, QueryFilter, UpdateQuery } from "mongoose";
import type { ISavedWorkView } from "../models/work/ISavedWorkView.js";
import type { IWorkConfiguration } from "../models/work/IWorkConfiguration.js";
import type { IWorkTemplate } from "../models/work/IWorkTemplate.js";
import { SavedWorkViewModel } from "../models/work/SavedWorkView.js";
import { WorkConfigurationModel } from "../models/work/WorkConfiguration.js";
import { WorkTemplateModel } from "../models/work/WorkTemplate.js";
import { getTransactionSession } from "../transaction.js";
import type { DocumentQueryOptions, SessionWriteOptions } from "./queryTypes.js";

const createWorkConfigurationQuery = (value: AnyKeys<IWorkConfiguration>) =>
    new WorkConfigurationModel(value).save({ session: getTransactionSession() });
const getWorkConfigurationsQuery = (filter: QueryFilter<IWorkConfiguration> = {}) =>
    WorkConfigurationModel.find(filter);
const getWorkConfigurationQuery = (filter: QueryFilter<IWorkConfiguration>) =>
    WorkConfigurationModel.findOne(filter);
const getWorkConfigurationByIdQuery = (id: string) => WorkConfigurationModel.findById(id);
const updateWorkConfigurationQuery = (
    filter: QueryFilter<IWorkConfiguration>,
    update: UpdateQuery<IWorkConfiguration>,
    options?: DocumentQueryOptions<IWorkConfiguration>,
) => WorkConfigurationModel.findOneAndUpdate(filter, update, options);
const updateWorkConfigurationsQuery = (
    filter: QueryFilter<IWorkConfiguration>,
    update: UpdateQuery<IWorkConfiguration>,
    options?: SessionWriteOptions,
) => WorkConfigurationModel.updateMany(filter, update, options);

const createWorkTemplateQuery = (value: AnyKeys<IWorkTemplate>) =>
    new WorkTemplateModel(value).save({ session: getTransactionSession() });
const getWorkTemplatesQuery = (filter: QueryFilter<IWorkTemplate> = {}) => WorkTemplateModel.find(filter);
const getWorkTemplateByIdQuery = (id: string) => WorkTemplateModel.findById(id);

const createSavedWorkViewQuery = (value: AnyKeys<ISavedWorkView>) =>
    new SavedWorkViewModel(value).save({ session: getTransactionSession() });
const getSavedWorkViewsQuery = (filter: QueryFilter<ISavedWorkView> = {}) => SavedWorkViewModel.find(filter);
const getSavedWorkViewQuery = (filter: QueryFilter<ISavedWorkView>) => SavedWorkViewModel.findOne(filter);
const updateSavedWorkViewByIdQuery = (
    id: string,
    update: UpdateQuery<ISavedWorkView>,
    options?: DocumentQueryOptions<ISavedWorkView>,
) => SavedWorkViewModel.findByIdAndUpdate(id, update, options);
const deleteSavedWorkViewQuery = (filter: QueryFilter<ISavedWorkView>) =>
    SavedWorkViewModel.findOneAndDelete(filter);

export const WorkConfigurationQueries = {
    createWorkConfigurationQuery,
    getWorkConfigurationsQuery,
    getWorkConfigurationQuery,
    getWorkConfigurationByIdQuery,
    updateWorkConfigurationQuery,
    updateWorkConfigurationsQuery,
};

export const WorkTemplateQueries = {
    createWorkTemplateQuery,
    getWorkTemplatesQuery,
    getWorkTemplateByIdQuery,
};

export const SavedWorkViewQueries = {
    createSavedWorkViewQuery,
    getSavedWorkViewsQuery,
    getSavedWorkViewQuery,
    updateSavedWorkViewByIdQuery,
    deleteSavedWorkViewQuery,
};
