import { CreateProjectRequest } from "./createProjectRequest.js";
import { ProjectResponse } from "../../../models/project/ProjectResponse.js";

export const createProjectMapper = async (project: CreateProjectRequest, userId: string): Promise<ProjectResponse> => {
        const name: string = project.name;
        const organizerIds: string[] = [userId];
        const userIds: string[] = [];
        const communityId: string = project.communityId;
        const taskIds: string[] = [];
        const taskGroupIds: string[] = [];

        return {
            name,
            organizerIds,
            userIds,
            communityId,
            taskIds,
            taskGroupIds
        }
}