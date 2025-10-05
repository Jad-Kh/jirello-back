"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectQueries = void 0;
const Project_1 = require("../models/project/Project");
const Community_1 = require("../models/community/Community");
const createProjectQuery = async (body) => {
    return await new Project_1.ProjectModel(body).save();
};
const getProjectByIdQuery = async (id) => {
    const project = await Project_1.ProjectModel.findOne({
        _id: id
    });
    return project;
};
const updateProjectQuery = async (id, updates) => {
    return await Project_1.ProjectModel.findByIdAndUpdate(id, updates, { new: true });
};
const getProjectByNameQuery = async (name) => {
    const project = await Project_1.ProjectModel.findOne({
        name: name,
    });
    return project;
};
const getProjectsOfCommunityQuery = async (communityId) => {
    const community = await Community_1.CommunityModel.findById(communityId).select("projectIds");
    const projectIds = community.projectIds;
    const projects = await Project_1.ProjectModel.find({
        _id: { $in: projectIds }
    });
    return projects;
};
const getProjectsOfCommunityPaginatedQuery = async (communityId, skip, limit) => {
    const community = await Community_1.CommunityModel.findById(communityId).select("projectIds");
    const projectIds = community.projectIds;
    const projects = await Project_1.ProjectModel.find({
        _id: { $in: projectIds }
    }).skip(skip)
        .limit(limit);
    return projects;
};
const updateProjectCommunityQuery = async (projectId, communityId) => {
    return await Project_1.ProjectModel.findByIdAndUpdate(projectId, { communityId: communityId });
};
exports.ProjectQueries = {
    createProjectQuery,
    getProjectByIdQuery,
    updateProjectQuery,
    getProjectByNameQuery,
    getProjectsOfCommunityQuery,
    getProjectsOfCommunityPaginatedQuery,
    updateProjectCommunityQuery
};
