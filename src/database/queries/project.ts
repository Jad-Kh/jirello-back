import { UpdateQuery } from "mongoose";
import { CommunityModel } from "../models/community/Community.js";
import { IProject } from "../models/project/IProject.js";
import { ProjectModel } from "../models/project/Project.js";
import { getTransactionSession } from "../transaction.js";

const createProjectQuery = async (body: IProject) => {
    return await new ProjectModel(body).save({ session: getTransactionSession() });
};

const getProjectByIdQuery = async (id: string) => {
    const project = await ProjectModel.findOne({
        _id: id,
    });
    return project;
};

const updateProjectQuery = async (id: string, updates: UpdateQuery<IProject>) => {
    return await ProjectModel.findByIdAndUpdate(id, updates, { new: true, session: getTransactionSession() });
};

const getProjectByNameQuery = async (name: string, communityId?: string) => {
    const project = await ProjectModel.findOne({
        name,
        ...(communityId ? { communityId } : {}),
    });
    return project;
};

const getProjectsByIdsQuery = (projectIds: string[]) =>
    ProjectModel.find({ _id: { $in: projectIds } }).select("communityId");

const getProjectsOfCommunityQuery = async (communityId: string) => {
    const community = await CommunityModel.findById(communityId).select("projectIds");
    if (!community) return [];
    const projectIds = community.projectIds;
    const projects = await ProjectModel.find({
        _id: { $in: projectIds },
    });
    return projects;
};

const getProjectsOfCommunityPaginatedQuery = async (
    communityId: string,
    skip: number,
    limit: number,
    search?: string,
) => {
    const escapedSearch = search?.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const projects = await ProjectModel.find({
        communityId,
        ...(escapedSearch ? { name: { $regex: "^" + escapedSearch, $options: "i" } } : {}),
    })
        .sort({ name: 1, _id: 1 })
        .skip(skip)
        .limit(limit);
    return projects;
};

const updateProjectCommunityQuery = async (projectId: string, communityId: string) => {
    return await ProjectModel.findByIdAndUpdate(
        projectId,
        { communityId: communityId },
        { session: getTransactionSession() },
    );
};

const deleteProjectQuery = async (projectId: string) =>
    ProjectModel.findByIdAndDelete(projectId, { session: getTransactionSession() });

const addTaskToProjectQuery = async (projectId: string, taskId: string) =>
    ProjectModel.updateOne(
        { _id: projectId },
        { $addToSet: { taskIds: taskId } },
        { session: getTransactionSession() },
    );

const removeTaskFromProjectQuery = async (projectId: string, taskId: string) =>
    ProjectModel.updateOne(
        { _id: projectId },
        { $pull: { taskIds: taskId } },
        { session: getTransactionSession() },
    );

export const ProjectQueries = {
    createProjectQuery,
    getProjectByIdQuery,
    updateProjectQuery,
    getProjectByNameQuery,
    getProjectsByIdsQuery,
    getProjectsOfCommunityQuery,
    getProjectsOfCommunityPaginatedQuery,
    updateProjectCommunityQuery,
    deleteProjectQuery,
    addTaskToProjectQuery,
    removeTaskFromProjectQuery,
};
