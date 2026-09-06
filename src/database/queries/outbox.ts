import type { AnyKeys, QueryFilter, UpdateQuery } from "mongoose";
import type { IOutboxEvent } from "../models/outbox/IOutboxEvent.js";
import { OutboxEventModel } from "../models/outbox/OutboxEvent.js";
import { getTransactionSession } from "../transaction.js";
import type { DocumentQueryOptions, SessionWriteOptions } from "./queryTypes.js";

const createOutboxEventQuery = (value: AnyKeys<IOutboxEvent>) =>
    new OutboxEventModel(value).save({ session: getTransactionSession() });
const getOutboxEventsQuery = (filter: QueryFilter<IOutboxEvent> = {}) => OutboxEventModel.find(filter);
const countOutboxEventsQuery = (filter: QueryFilter<IOutboxEvent> = {}) =>
    OutboxEventModel.countDocuments(filter);
const claimOutboxEventQuery = (
    filter: QueryFilter<IOutboxEvent>,
    update: UpdateQuery<IOutboxEvent>,
    options?: DocumentQueryOptions<IOutboxEvent>,
) => OutboxEventModel.findOneAndUpdate(filter, update, options);
const updateOutboxEventQuery = (
    filter: QueryFilter<IOutboxEvent>,
    update: UpdateQuery<IOutboxEvent>,
    options?: SessionWriteOptions,
) => OutboxEventModel.updateOne(filter, update, options);

export const OutboxEventQueries = {
    createOutboxEventQuery,
    getOutboxEventsQuery,
    countOutboxEventsQuery,
    claimOutboxEventQuery,
    updateOutboxEventQuery,
};
