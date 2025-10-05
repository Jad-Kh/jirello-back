import { RoleResponse } from "./RoleResponse.ts";

export class RolesOfUserResponse {
    roles: RoleResponse[];

    constructor(values: RolesOfUserResponse) {
        this.roles = values.roles;
    }
}