import { ProjectResponse } from "./ProjectResponse.js";

export class ProjectsOfUserResponse {
    projects: ProjectResponse[];

    constructor(values: ProjectsOfUserResponse | ProjectResponse[]) {
        const projects = Array.isArray(values) ? values : values.projects;
        this.projects = projects.map((project) => new ProjectResponse(project));
    }
}
