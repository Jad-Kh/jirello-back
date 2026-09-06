import type { AnyKeys, QueryFilter, UpdateQuery } from "mongoose";
import { CommunityInvitationModel } from "../models/invitation/CommunityInvitation.js";
import type { ICommunityInvitation } from "../models/invitation/ICommunityInvitation.js";
import { getTransactionSession } from "../transaction.js";
import type { DocumentQueryOptions, SessionWriteOptions } from "./queryTypes.js";

const createCommunityInvitationQuery = (value: AnyKeys<ICommunityInvitation>) =>
    new CommunityInvitationModel(value).save({ session: getTransactionSession() });
const getCommunityInvitationsQuery = (filter: QueryFilter<ICommunityInvitation> = {}) =>
    CommunityInvitationModel.find(filter);
const getCommunityInvitationQuery = (filter: QueryFilter<ICommunityInvitation>) =>
    CommunityInvitationModel.findOne(filter);
const updateCommunityInvitationQuery = (
    filter: QueryFilter<ICommunityInvitation>,
    update: UpdateQuery<ICommunityInvitation>,
    options?: DocumentQueryOptions<ICommunityInvitation>,
) => CommunityInvitationModel.findOneAndUpdate(filter, update, options);
const updateCommunityInvitationsQuery = (
    filter: QueryFilter<ICommunityInvitation>,
    update: UpdateQuery<ICommunityInvitation>,
    options?: SessionWriteOptions,
) => CommunityInvitationModel.updateMany(filter, update, options);

export const CommunityInvitationQueries = {
    createCommunityInvitationQuery,
    getCommunityInvitationsQuery,
    getCommunityInvitationQuery,
    updateCommunityInvitationQuery,
    updateCommunityInvitationsQuery,
};
