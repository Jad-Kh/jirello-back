import { ProjectModel } from "../models/project/Project";
import { CommunityModel } from "../models/community/Community";

const createProjectQuery = async (body) => {
    return await new ProjectModel(body).save();
};

const getProjectByIdQuery = async (id: string) => {
    const project = await ProjectModel.findOne({
        _id: id
    });
    return project;
};

const updateProjectQuery = async (id: string, updates) => {
    return await ProjectModel.findByIdAndUpdate(
        id,
        updates,
        { new: true }
    );
};

const getProjectByNameQuery = async (name: string) => {
    const project = await ProjectModel.findOne({
        name: name,
    });
    return project;
};

const getProjectsOfCommunityQuery = async (communityId: string) => {
    const community = await CommunityModel.findById(communityId).select("projectIds");
    const projectIds = community.projectIds;
    const projects = await ProjectModel.find({
        _id: { $in: projectIds }
    });
    return projects;
};

const getProjectsOfCommunityPaginatedQuery = async (communityId: string, skip: number, limit: number) => {
    const community = await CommunityModel.findById(communityId).select("projectIds");
    const projectIds = community.projectIds;
    const projects = await ProjectModel.find({
        _id: { $in: projectIds }
    }).skip(skip)
        .limit(limit);
    return projects;
};

const updateProjectCommunityQuery = async (projectId: string, communityId: string) => {
    return await ProjectModel.findByIdAndUpdate(
        projectId,
        { communityId: communityId }
    );
};

export const ProjectQueries = {
    createProjectQuery,
    getProjectByIdQuery,
    updateProjectQuery,
    getProjectByNameQuery,
    getProjectsOfCommunityQuery,
    getProjectsOfCommunityPaginatedQuery,
    updateProjectCommunityQuery
}