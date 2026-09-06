import type { AnyKeys, QueryFilter, QueryOptions, UpdateQuery } from "mongoose";
import { ClientPortalModel } from "../models/portal/ClientPortal.js";
import { DeliverableModel } from "../models/portal/Deliverable.js";
import { GuestAccessModel } from "../models/portal/GuestAccess.js";
import type { IClientPortal } from "../models/portal/IClientPortal.js";
import type { IDeliverable } from "../models/portal/IDeliverable.js";
import type { IGuestAccess } from "../models/portal/IGuestAccess.js";
import type { IPortalComment } from "../models/portal/IPortalComment.js";
import { PortalCommentModel } from "../models/portal/PortalComment.js";
import { getTransactionSession } from "../transaction.js";

const getClientPortalsQuery = (filter: QueryFilter<IClientPortal> = {}) => ClientPortalModel.find(filter);
const getClientPortalQuery = (filter: QueryFilter<IClientPortal>) => ClientPortalModel.findOne(filter);
const updateClientPortalQuery = (
    filter: QueryFilter<IClientPortal>,
    update: UpdateQuery<IClientPortal>,
    options?: QueryOptions<IClientPortal>,
) => ClientPortalModel.findOneAndUpdate(filter, update, options);

const createDeliverableQuery = (value: AnyKeys<IDeliverable>) =>
    new DeliverableModel(value).save({ session: getTransactionSession() });
const getDeliverablesQuery = (filter: QueryFilter<IDeliverable> = {}) => DeliverableModel.find(filter);
const getDeliverableByIdQuery = (id: string) => DeliverableModel.findById(id);
const deliverableExistsQuery = (filter: QueryFilter<IDeliverable>) => DeliverableModel.exists(filter);
const updateDeliverableQuery = (
    filter: QueryFilter<IDeliverable>,
    update: UpdateQuery<IDeliverable>,
    options?: QueryOptions<IDeliverable>,
) => DeliverableModel.findOneAndUpdate(filter, update, options);

const getGuestAccessesQuery = (filter: QueryFilter<IGuestAccess> = {}) => GuestAccessModel.find(filter);
const getGuestAccessQuery = (filter: QueryFilter<IGuestAccess>) => GuestAccessModel.findOne(filter);
const getGuestAccessByIdQuery = (id: string) => GuestAccessModel.findById(id);
const updateGuestAccessQuery = (
    filter: QueryFilter<IGuestAccess>,
    update: UpdateQuery<IGuestAccess>,
    options?: QueryOptions<IGuestAccess>,
) => GuestAccessModel.findOneAndUpdate(filter, update, options);

const createPortalCommentQuery = (value: AnyKeys<IPortalComment>) =>
    new PortalCommentModel(value).save({ session: getTransactionSession() });
const getPortalCommentsQuery = (filter: QueryFilter<IPortalComment> = {}) => PortalCommentModel.find(filter);

export const ClientPortalQueries = {
    getClientPortalsQuery,
    getClientPortalQuery,
    updateClientPortalQuery,
};

export const DeliverableQueries = {
    createDeliverableQuery,
    getDeliverablesQuery,
    getDeliverableByIdQuery,
    deliverableExistsQuery,
    updateDeliverableQuery,
};

export const GuestAccessQueries = {
    getGuestAccessesQuery,
    getGuestAccessQuery,
    getGuestAccessByIdQuery,
    updateGuestAccessQuery,
};

export const PortalCommentQueries = {
    createPortalCommentQuery,
    getPortalCommentsQuery,
};
