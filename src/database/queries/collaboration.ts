import type { AnyKeys, QueryFilter, UpdateQuery } from "mongoose";
import type { ICollaborationMessage } from "../models/collaboration/ICollaborationMessage.js";
import type { IConversationRead } from "../models/collaboration/IConversationRead.js";
import type { IMessageReport } from "../models/collaboration/IMessageReport.js";
import { CollaborationMessageModel } from "../models/collaboration/CollaborationMessage.js";
import { ConversationReadModel } from "../models/collaboration/ConversationRead.js";
import { MessageReportModel } from "../models/collaboration/MessageReport.js";
import { getTransactionSession } from "../transaction.js";
import type { DocumentQueryOptions, SessionWriteOptions } from "./queryTypes.js";

const createCollaborationMessageQuery = (value: AnyKeys<ICollaborationMessage>) =>
    new CollaborationMessageModel(value).save({ session: getTransactionSession() });
const getCollaborationMessagesQuery = (filter: QueryFilter<ICollaborationMessage> = {}) =>
    CollaborationMessageModel.find(filter);
const getCollaborationMessageByIdQuery = (id: string) => CollaborationMessageModel.findById(id);
const countCollaborationMessagesQuery = (filter: QueryFilter<ICollaborationMessage> = {}) =>
    CollaborationMessageModel.countDocuments(filter);
const updateCollaborationMessageQuery = (
    filter: QueryFilter<ICollaborationMessage>,
    update: UpdateQuery<ICollaborationMessage>,
    options?: DocumentQueryOptions<ICollaborationMessage>,
) => CollaborationMessageModel.findOneAndUpdate(filter, update, options);
const updateCollaborationMessageFieldsQuery = (
    filter: QueryFilter<ICollaborationMessage>,
    update: UpdateQuery<ICollaborationMessage>,
    options?: SessionWriteOptions,
) => CollaborationMessageModel.updateOne(filter, update, options);

const getConversationReadQuery = (filter: QueryFilter<IConversationRead>) =>
    ConversationReadModel.findOne(filter);
const updateConversationReadQuery = (
    filter: QueryFilter<IConversationRead>,
    update: UpdateQuery<IConversationRead>,
    options?: DocumentQueryOptions<IConversationRead>,
) => ConversationReadModel.findOneAndUpdate(filter, update, options);

const createMessageReportQuery = (value: AnyKeys<IMessageReport>) =>
    new MessageReportModel(value).save({ session: getTransactionSession() });
const getMessageReportsQuery = (filter: QueryFilter<IMessageReport> = {}) => MessageReportModel.find(filter);
const getMessageReportByIdQuery = (id: string) => MessageReportModel.findById(id);
const updateMessageReportByIdQuery = (
    id: string,
    update: UpdateQuery<IMessageReport>,
    options?: DocumentQueryOptions<IMessageReport>,
) => MessageReportModel.findByIdAndUpdate(id, update, options);

export const CollaborationMessageQueries = {
    createCollaborationMessageQuery,
    getCollaborationMessagesQuery,
    getCollaborationMessageByIdQuery,
    countCollaborationMessagesQuery,
    updateCollaborationMessageQuery,
    updateCollaborationMessageFieldsQuery,
};

export const ConversationReadQueries = {
    getConversationReadQuery,
    updateConversationReadQuery,
};

export const MessageReportQueries = {
    createMessageReportQuery,
    getMessageReportsQuery,
    getMessageReportByIdQuery,
    updateMessageReportByIdQuery,
};
