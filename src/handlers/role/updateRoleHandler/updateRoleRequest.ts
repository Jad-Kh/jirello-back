export type UpdateRoleRequest = {
    id: string;
    title: string;
    overrideAll: string;
    parentRoleId: string;
    priorityPosition: number;
    projectBased: boolean;
    projectIds: string[];
};