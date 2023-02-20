import { ProjectModel } from "../../models/project/project.js";
import { CommunityModel } from "../../models/community/community.js";

const createProjectQuery = async (body) => {
    return await ProjectModel(body).save();
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

export {
    createProjectQuery,
    getProjectByNameQuery,
    getProjectsOfCommunityQuery,
    getProjectsOfCommunityPaginatedQuery
}