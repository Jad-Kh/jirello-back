export type UpdateCommunityPermissionsRequest = {
    id: string;
    tasks: number[];
    taskGroups: number[];
    meetings: number[];
    projects: number[];
    screens: number[];
    roles: number[];
    users: number[];
    communities: number[];
};
