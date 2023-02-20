import { ProjectResponseModel } from "./ProjectResponseModel.js";

class ProjectsOfCommunityResponseModel {
    projects = [];

    constructor(values) {
        this.projects = values?.map(project =>  new ProjectResponseModel(project));
    }
}

export {
    ProjectsOfCommunityResponseModel
}