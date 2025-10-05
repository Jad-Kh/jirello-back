import { ProjectResponse } from "./ProjectResponse.ts";

export class ProjectsOfUserResponse {
    projects: ProjectResponse[];

    constructor(values: ProjectsOfUserResponse) {
        this.projects = values.projects;
    };
}