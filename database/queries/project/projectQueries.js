import { ProjectModel } from "../../models/project/project.js";
import { CommunityModel } from "../../models/community/community.js";

const createProjectQuery = async (body) => {
    return await ProjectModel(body).save();
};

const getProjectByIdQuery = async (id) => {
    const project = await ProjectModel.findOne({
        _id: id
    });
    return project;
};

const updateProjectQuery = async (id, updates) => {
    return await ProjectModel.findByIdAndUpdate(
        id,
        updates,
        { new: true }
    );
};

const getProjectByNameQuery = async (name) => {
    const project = await ProjectModel.findOne({
        name: name,
    });
    return project;
};

const getProjectsOfCommunityQuery = async (communityId) => {
    const community = await CommunityModel.findById(communityId).select("projectIds");
    const projectIds = community.projectIds;
    const projects = await ProjectModel.find({ 
        _id: { $in: projectIds } 
    });
    return projects;    
};

const getProjectsOfCommunityPaginatedQuery = async (communityId, skip, limit) => {
    const community = await CommunityModel.findById(communityId).select("projectIds");
    const projectIds = community.projectIds;
    const projects = await ProjectModel.find({ 
        _id: { $in: projectIds } 
    }).skip(skip)
    .limit(limit);
    return projects;    
};

const updateProjectCommunityQuery = async (projectId, communityId) => {
    return await ProjectModel.findByIdAndUpdate(
        projectId,
        { communityId: communityId }
    );
};

export {
    createProjectQuery,
    getProjectByIdQuery,
    updateProjectQuery,
    getProjectByNameQuery,
    getProjectsOfCommunityQuery,
    getProjectsOfCommunityPaginatedQuery,
    updateProjectCommunityQuery
}