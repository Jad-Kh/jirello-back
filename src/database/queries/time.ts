import type { AnyKeys, QueryFilter, UpdateQuery } from "mongoose";
import type { IMemberCapacity } from "../models/time/IMemberCapacity.js";
import type { ITimeEntry } from "../models/time/ITimeEntry.js";
import { MemberCapacityModel } from "../models/time/MemberCapacity.js";
import { TimeEntryModel } from "../models/time/TimeEntry.js";
import { getTransactionSession } from "../transaction.js";
import type { DocumentQueryOptions, SessionWriteOptions } from "./queryTypes.js";

const getMemberCapacitiesQuery = (filter: QueryFilter<IMemberCapacity> = {}) =>
    MemberCapacityModel.find(filter);
const countMemberCapacitiesQuery = (filter: QueryFilter<IMemberCapacity> = {}) =>
    MemberCapacityModel.countDocuments(filter);

const updateMemberCapacityQuery = (
    filter: QueryFilter<IMemberCapacity>,
    update: UpdateQuery<IMemberCapacity>,
    options?: DocumentQueryOptions<IMemberCapacity>,
) => MemberCapacityModel.findOneAndUpdate(filter, update, options);

const createTimeEntryQuery = (value: AnyKeys<ITimeEntry>) =>
    new TimeEntryModel(value).save({ session: getTransactionSession() });

const getTimeEntriesQuery = (filter: QueryFilter<ITimeEntry> = {}) => TimeEntryModel.find(filter);
const countTimeEntriesQuery = (filter: QueryFilter<ITimeEntry> = {}) => TimeEntryModel.countDocuments(filter);
const getTimeEntryByIdQuery = (id: string) => TimeEntryModel.findById(id);
const timeEntryExistsQuery = (filter: QueryFilter<ITimeEntry>) => TimeEntryModel.exists(filter);

const updateTimeEntryQuery = (
    filter: QueryFilter<ITimeEntry>,
    update: UpdateQuery<ITimeEntry>,
    options?: DocumentQueryOptions<ITimeEntry>,
) => TimeEntryModel.findOneAndUpdate(filter, update, options);

const updateTimeEntriesQuery = (
    filter: QueryFilter<ITimeEntry>,
    update: UpdateQuery<ITimeEntry>,
    options?: SessionWriteOptions,
) => TimeEntryModel.updateMany(filter, update, options);

export const MemberCapacityQueries = {
    getMemberCapacitiesQuery,
    countMemberCapacitiesQuery,
    updateMemberCapacityQuery,
};

export const TimeEntryQueries = {
    createTimeEntryQuery,
    getTimeEntriesQuery,
    countTimeEntriesQuery,
    getTimeEntryByIdQuery,
    timeEntryExistsQuery,
    updateTimeEntryQuery,
    updateTimeEntriesQuery,
};
