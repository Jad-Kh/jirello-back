import { createPresenter } from "../helpers/presenting";
import { ProjectSuccessResponses } from "../responses/success/ProjectSuccessResponses.ts";
import { ProjectResponse } from "../models/project/ProjectResponse.ts";
import { ProjectsOfUserResponse } from "../models/project/ProjectsOfUserResponse.ts";

export const createProjectPresenter = createPresenter(
    ProjectSuccessResponses.CREATE_PROJECT_SUCCESS,
    ProjectResponse,
    "project"
);

export const updateProjectPresenter = createPresenter(
    ProjectSuccessResponses.UPDATE_PROJECT_SUCCESS,
    ProjectResponse,
    "project"
);

export const deleteProjectPresenter = createPresenter(
    ProjectSuccessResponses.DELETE_PROJECT_SUCCESS,
    ProjectResponse,
    "project"
);

export const getUserProjectsPresenter = createPresenter(
    ProjectSuccessResponses.PROJECTS_OF_USER_SUCCESS,
    ProjectsOfUserResponse,
    "projects",
    true
);
