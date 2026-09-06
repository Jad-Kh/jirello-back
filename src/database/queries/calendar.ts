import type { AnyKeys, QueryFilter, UpdateQuery } from "mongoose";
import { CalendarModel } from "../models/calendar/Calendar.js";
import { CalendarEventModel } from "../models/calendar/CalendarEvent.js";
import { CalendarReminderDeliveryModel } from "../models/calendar/CalendarReminderDelivery.js";
import type { ICalendar } from "../models/calendar/ICalendar.js";
import type { ICalendarEvent } from "../models/calendar/ICalendarEvent.js";
import type { ICalendarReminderDelivery } from "../models/calendar/ICalendarReminderDelivery.js";
import { getTransactionSession } from "../transaction.js";
import type { DocumentQueryOptions, SessionWriteOptions } from "./queryTypes.js";

const createCalendarQuery = (value: AnyKeys<ICalendar>) =>
    new CalendarModel(value).save({ session: getTransactionSession() });
const getCalendarsQuery = (filter: QueryFilter<ICalendar> = {}) => CalendarModel.find(filter);
const getCalendarQuery = (filter: QueryFilter<ICalendar>) => CalendarModel.findOne(filter);
const getCalendarByIdQuery = (id: string) => CalendarModel.findById(id);
const updateCalendarQuery = (
    filter: QueryFilter<ICalendar>,
    update: UpdateQuery<ICalendar>,
    options?: DocumentQueryOptions<ICalendar>,
) => CalendarModel.findOneAndUpdate(filter, update, options);
const updateCalendarsQuery = (
    filter: QueryFilter<ICalendar>,
    update: UpdateQuery<ICalendar>,
    options?: SessionWriteOptions,
) => CalendarModel.updateMany(filter, update, options);

const createCalendarEventQuery = (value: AnyKeys<ICalendarEvent>) =>
    new CalendarEventModel(value).save({ session: getTransactionSession() });
const getCalendarEventsQuery = (filter: QueryFilter<ICalendarEvent> = {}) => CalendarEventModel.find(filter);
const getCalendarEventQuery = (filter: QueryFilter<ICalendarEvent>) => CalendarEventModel.findOne(filter);
const getCalendarEventByIdQuery = (id: string) => CalendarEventModel.findById(id);
const updateCalendarEventQuery = (
    filter: QueryFilter<ICalendarEvent>,
    update: UpdateQuery<ICalendarEvent>,
    options?: DocumentQueryOptions<ICalendarEvent>,
) => CalendarEventModel.findOneAndUpdate(filter, update, options);
const deleteCalendarEventQuery = (
    filter: QueryFilter<ICalendarEvent>,
    options?: DocumentQueryOptions<ICalendarEvent>,
) => CalendarEventModel.findOneAndDelete(filter, options);

const createCalendarReminderDeliveryQuery = (value: AnyKeys<ICalendarReminderDelivery>) =>
    new CalendarReminderDeliveryModel(value).save({ session: getTransactionSession() });
const getCalendarReminderDeliveryQuery = (filter: QueryFilter<ICalendarReminderDelivery>) =>
    CalendarReminderDeliveryModel.findOne(filter);
const updateCalendarReminderDeliveryQuery = (id: string, update: UpdateQuery<ICalendarReminderDelivery>) =>
    CalendarReminderDeliveryModel.findByIdAndUpdate(id, update, { new: true });

export const CalendarQueries = {
    createCalendarQuery,
    getCalendarsQuery,
    getCalendarQuery,
    getCalendarByIdQuery,
    updateCalendarQuery,
    updateCalendarsQuery,
};

export const CalendarEventQueries = {
    createCalendarEventQuery,
    getCalendarEventsQuery,
    getCalendarEventQuery,
    getCalendarEventByIdQuery,
    updateCalendarEventQuery,
    deleteCalendarEventQuery,
};

export const CalendarReminderDeliveryQueries = {
    createCalendarReminderDeliveryQuery,
    getCalendarReminderDeliveryQuery,
    updateCalendarReminderDeliveryQuery,
};
