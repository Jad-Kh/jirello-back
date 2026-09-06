import { ICommunityPermissions } from "../database/models/community/ICommunityPermissions.js";
import { IRole } from "../database/models/role/IRole.js";

export const permissionTypes = {
    TASKS: "tasks",
    TASK_GROUPS: "taskGroups",
    MEETINGS: "meetings",
    PROJECTS: "projects",
    SCREENS: "screens",
    ROLES: "roles",
} as const;

export const Permissions = {
    READ_OWN: 1,
    CREATE_OWN: 2,
    EDIT_OWN: 3,
    DELETE_OWN: 4,
    CHANGE_OWN: 5,
    READ_OTHER: 6,
    CREATE_OTHER: 7,
    EDIT_OTHER: 8,
    DELETE_OTHER: 9,
    CHANGE_OTHER: 10,
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];
export type PermissionDomain = keyof Omit<ICommunityPermissions, "id" | "createdAt" | "updatedAt">;
export type PermissionSet = Record<PermissionDomain, Set<number>>;

const permissionDomains: PermissionDomain[] = [
    "tasks",
    "taskGroups",
    "meetings",
    "projects",
    "screens",
    "roles",
    "users",
    "communities",
];

export const createPermissionsResponse = (
    permissions: Partial<Record<PermissionDomain, Iterable<number>>>,
): PermissionSet =>
    Object.fromEntries(
        permissionDomains.map((domain) => [domain, new Set(permissions[domain] ?? [])]),
    ) as PermissionSet;

export const createMaxRolePermissionResponse = (): PermissionSet => {
    const allPermissions = Object.values(Permissions);
    return createPermissionsResponse(
        Object.fromEntries(permissionDomains.map((domain) => [domain, allPermissions])),
    );
};

export const aggregatePermissions = (roles: IRole[]): PermissionSet => {
    const aggregated = createPermissionsResponse({});

    for (const role of roles) {
        for (const domain of permissionDomains) {
            for (const permission of role.permissionOverrides?.[domain] ?? []) {
                aggregated[domain].add(Number(permission));
            }
        }
    }

    return aggregated;
};

export const hasPermission = (
    userPermissions: PermissionSet,
    domain: PermissionDomain,
    requiredPermissions: readonly number[],
): boolean => requiredPermissions.some((permission) => userPermissions[domain].has(permission));
