import { ProjectModel } from "../../models/project/project.js";

const createProjectQuery = async (body) => {
    return await ProjectModel(body).save();
};

const getProjectByNameQuery = async (name) => {
    const project = await ProjectModel.findOne({
        name: name,
    });
    return project;
};

export {
    createProjectQuery,
    getProjectByNameQuery
}