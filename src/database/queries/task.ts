import type { AnyKeys, QueryFilter, UpdateQuery } from "mongoose";
import type { ITask } from "../models/task/ITask.js";
import { TaskModel } from "../models/task/Task.js";
import { getTransactionSession } from "../transaction.js";
import type { DocumentQueryOptions, SessionWriteOptions } from "./queryTypes.js";

const createTaskQuery = (value: AnyKeys<ITask>) =>
    new TaskModel(value).save({ session: getTransactionSession() });
const getTasksQuery = (filter: QueryFilter<ITask> = {}) => TaskModel.find(filter);
const getTaskQuery = (filter: QueryFilter<ITask>) => TaskModel.findOne(filter);
const getTaskByIdQuery = (id: string) => TaskModel.findById(id);
const countTasksQuery = (filter: QueryFilter<ITask> = {}) => TaskModel.countDocuments(filter);
const taskExistsQuery = (filter: QueryFilter<ITask>) => TaskModel.exists(filter);
const updateTaskQuery = (
    filter: QueryFilter<ITask>,
    update: UpdateQuery<ITask>,
    options?: DocumentQueryOptions<ITask>,
) => TaskModel.findOneAndUpdate(filter, update, options);
const deleteTaskQuery = (filter: QueryFilter<ITask>, options?: SessionWriteOptions) =>
    TaskModel.deleteOne(filter, options);

export const TaskQueries = {
    createTaskQuery,
    getTasksQuery,
    getTaskQuery,
    getTaskByIdQuery,
    countTasksQuery,
    taskExistsQuery,
    updateTaskQuery,
    deleteTaskQuery,
};
