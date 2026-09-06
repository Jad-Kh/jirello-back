export type UpdateRoleRequest = {
    id: string;
    title?: string;
    overrideAll?: boolean;
    parentRoleId?: string;
    priorityPosition?: number;
    projectBased?: boolean;
    projectIds?: string[];
};
