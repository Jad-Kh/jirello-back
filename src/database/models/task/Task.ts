import mongoose, { Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { ITask } from "./ITask.js";
import { TaskUsers } from "./TaskUsers.js";

const TaskModelSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: { type: String, maxlength: 5000, default: "" },
        priority: {
            type: String,
            required: true,
        },
        deadline: {
            type: String,
            required: true,
            default: "Unlimited",
        },
        deadlineAt: { type: Date },
        accomplished: {
            type: Boolean,
            required: true,
            default: false,
        },
        projectId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: "To do",
        },
        position: { type: Number, required: true, default: 0 },
        version: { type: Number, required: true, default: 1 },
        typeKey: { type: String, required: true, default: "task", trim: true, lowercase: true },
        customFields: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
        parentId: { type: String },
        dependencyIds: { type: [String], default: [] },
        relatedTaskIds: { type: [String], default: [] },
        tags: { type: [String], default: [] },
        startAt: { type: Date },
        estimatedMinutes: { type: Number, min: 0 },
        milestone: { type: Boolean, required: true, default: false },
        recurrence: {
            frequency: { type: String, enum: ["daily", "weekly", "monthly"] },
            interval: { type: Number, min: 1, max: 365, default: 1 },
            until: { type: Date },
        },
        recurrenceGeneratedAt: { type: Date },
        audience: { type: String, enum: ["internal", "client"], required: true, default: "internal" },
        idempotencyKey: { type: String, trim: true, select: false },
        requestHash: { type: String, select: false },
        users: {
            type: TaskUsers,
        },
    },
    {
        timestamps: true,
    },
);

TaskModelSchema.plugin(mongoosePaginate);
TaskModelSchema.index({ projectId: 1, status: 1, position: 1, _id: 1 });
TaskModelSchema.index(
    { projectId: 1, title: "text", description: "text", tags: "text" },
    { name: "task_project_search" },
);
TaskModelSchema.index({ accomplished: 1, deadlineAt: 1 });
TaskModelSchema.index({ projectId: 1, typeKey: 1, createdAt: -1 });
TaskModelSchema.index({ projectId: 1, parentId: 1 });
TaskModelSchema.index({ "users.userIds": 1, startAt: 1, deadlineAt: 1 });
TaskModelSchema.index(
    { projectId: 1, "users.createdBy": 1, idempotencyKey: 1 },
    {
        unique: true,
        partialFilterExpression: { idempotencyKey: { $type: "string" } },
    },
);

const TaskModel: Model<ITask> = mongoose.model<ITask>("Tasks", TaskModelSchema);

export { TaskModel };
