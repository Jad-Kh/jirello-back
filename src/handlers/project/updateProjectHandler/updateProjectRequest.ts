export type UpdateProjectRequest = {
    id: string;
    name?: string;
    communityId?: string;
    organizerIds?: string[];
    userIds?: string[];
    taskIds?: string[];
    taskGroupIds?: string[];
};
