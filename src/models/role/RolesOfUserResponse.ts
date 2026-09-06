import { RoleResponse } from "./RoleResponse.js";

export class RolesOfUserResponse {
    roles: RoleResponse[];

    constructor(values: RolesOfUserResponse | RoleResponse[]) {
        const roles = Array.isArray(values) ? values : values.roles;
        this.roles = roles.map((role) => new RoleResponse(role));
    }
}
