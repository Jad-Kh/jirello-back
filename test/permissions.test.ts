import { describe, expect, it } from "vitest";
import { IRole } from "../src/database/models/role/IRole.js";
import {
    aggregatePermissions,
    createMaxRolePermissionResponse,
    createPermissionsResponse,
    hasPermission,
    Permissions,
} from "../src/helpers/permissions.js";

describe("permission helpers", () => {
    it("grants every permission to administrators and owners", () => {
        const permissions = createMaxRolePermissionResponse();

        expect(hasPermission(permissions, "users", [Permissions.READ_OWN])).toBe(true);
        expect(hasPermission(permissions, "projects", [Permissions.CHANGE_OTHER])).toBe(true);
    });

    it("normalizes arrays into sets", () => {
        const permissions = createPermissionsResponse({ users: [1, 1, 6] });

        expect([...permissions.users]).toEqual([1, 6]);
        expect(permissions.projects.size).toBe(0);
    });

    it("unions permission overrides from multiple roles", () => {
        const base = {
            tasks: [],
            taskGroups: [],
            meetings: [],
            projects: [],
            screens: [],
            roles: [],
            users: [],
            communities: [],
        };
        const roles = [
            { permissionOverrides: { ...base, users: [Permissions.READ_OTHER] } },
            { permissionOverrides: { ...base, users: [Permissions.CHANGE_OTHER] } },
        ] as IRole[];

        const permissions = aggregatePermissions(roles);
        expect([...permissions.users]).toEqual([Permissions.READ_OTHER, Permissions.CHANGE_OTHER]);
    });
});
