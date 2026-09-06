import type {
    AnyKeys,
    InsertManyOptions,
    QueryFilter,
    QueryOptions,
    SaveOptions,
    UpdateQuery,
} from "mongoose";
import type { LabLedgerEntry } from "../models/learning/ILabLedgerEntry.js";
import type { LabOrder } from "../models/learning/ILabOrder.js";
import { LabLedgerEntryModel } from "../models/learning/LabLedgerEntry.js";
import { LabOrderModel } from "../models/learning/LabOrder.js";

const getLabOrdersQuery = (filter: QueryFilter<LabOrder> = {}) => LabOrderModel.find(filter);
const getLabOrderQuery = (filter: QueryFilter<LabOrder>) => LabOrderModel.findOne(filter);
const countLabOrdersQuery = (filter: QueryFilter<LabOrder> = {}) => LabOrderModel.countDocuments(filter);
const updateLabOrderQuery = (
    filter: QueryFilter<LabOrder>,
    update: UpdateQuery<LabOrder>,
    options?: QueryOptions<LabOrder>,
) => LabOrderModel.findOneAndUpdate(filter, update, options);
const createLabOrdersQuery = (values: Array<AnyKeys<LabOrder>>, options?: SaveOptions) =>
    Promise.all(values.map((value) => new LabOrderModel(value).save(options)));
const createManyLabOrdersQuery = (values: Array<AnyKeys<LabOrder>>, options?: InsertManyOptions) =>
    options ? LabOrderModel.insertMany(values, options) : LabOrderModel.insertMany(values);

const getLabLedgerEntryQuery = (filter: QueryFilter<LabLedgerEntry>) => LabLedgerEntryModel.findOne(filter);
const createLabLedgerEntriesQuery = (values: Array<AnyKeys<LabLedgerEntry>>, options?: SaveOptions) =>
    Promise.all(values.map((value) => new LabLedgerEntryModel(value).save(options)));

export const LabOrderQueries = {
    getLabOrdersQuery,
    getLabOrderQuery,
    countLabOrdersQuery,
    updateLabOrderQuery,
    createLabOrdersQuery,
    createManyLabOrdersQuery,
};

export const LabLedgerEntryQueries = {
    getLabLedgerEntryQuery,
    createLabLedgerEntriesQuery,
};
