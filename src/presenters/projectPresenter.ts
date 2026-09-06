import { createPresenter } from "../helpers/presenting.js";
import { ProjectResponse } from "../models/project/ProjectResponse.js";
import { ProjectsOfUserResponse } from "../models/project/ProjectsOfUserResponse.js";
import { ProjectSuccessResponses } from "../responses/success/ProjectSuccessResponses.js";

export const createProjectPresenter = createPresenter(
    ProjectSuccessResponses.CREATE_PROJECT_SUCCESS,
    ProjectResponse,
    "project",
);

export const updateProjectPresenter = createPresenter(
    ProjectSuccessResponses.UPDATE_PROJECT_SUCCESS,
    ProjectResponse,
    "project",
);

export const deleteProjectPresenter = createPresenter(
    ProjectSuccessResponses.DELETE_PROJECT_SUCCESS,
    ProjectResponse,
    "project",
);

export const getUserProjectsPresenter = createPresenter(
    ProjectSuccessResponses.PROJECTS_OF_USER_SUCCESS,
    ProjectsOfUserResponse,
    "projects",
    true,
);
