import type { QueryFilter, UpdateQuery } from "mongoose";
import type { INotification } from "../models/notification/INotification.js";
import { NotificationModel } from "../models/notification/Notification.js";
import { getTransactionSession } from "../transaction.js";
import type { DocumentQueryOptions, SessionWriteOptions } from "./queryTypes.js";

const createNotificationQuery = (value: INotification) =>
    new NotificationModel(value).save({ session: getTransactionSession() });
const getNotificationsQuery = (filter: QueryFilter<INotification> = {}) => NotificationModel.find(filter);
const countNotificationsQuery = (filter: QueryFilter<INotification> = {}) =>
    NotificationModel.countDocuments(filter);
const updateNotificationQuery = (
    filter: QueryFilter<INotification>,
    update: UpdateQuery<INotification>,
    options?: DocumentQueryOptions<INotification>,
) => NotificationModel.findOneAndUpdate(filter, update, options);
const updateNotificationsQuery = (
    filter: QueryFilter<INotification>,
    update: UpdateQuery<INotification>,
    options?: SessionWriteOptions,
) => NotificationModel.updateMany(filter, update, options);

export const NotificationQueries = {
    createNotificationQuery,
    getNotificationsQuery,
    countNotificationsQuery,
    updateNotificationQuery,
    updateNotificationsQuery,
};
