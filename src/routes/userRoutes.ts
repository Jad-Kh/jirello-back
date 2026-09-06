import { Request, Router } from "express";
import { getCommunityUsersHandler } from "../handlers/user/getCommunityUsersHandler/getCommunityUsersHandler.js";
import { getCommunityUsersPaginatedHandler } from "../handlers/user/getCommunityUsersPaginatedHandler/getCommunityUsersPaginatedHandler.js";
import { getRoleUsersHandler } from "../handlers/user/getRoleUsersHandler/getRoleUsersHandler.js";
import { getRoleUsersHandler as getRoleUsersPaginatedHandler } from "../handlers/user/getRoleUsersPaginatedHandler/getRoleUsersPaginatedHandler.js";
import { getUserByEmailHandler } from "../handlers/user/getUserByEmailHandler/getUserByEmailHandler.js";
import { getUserByIdHandler } from "../handlers/user/getUserByIdHandler/getUserByIdHandler.js";
import { getUserByUsernameHandler } from "../handlers/user/getUserByUsernameHandler/getUserByUsernameHandler.js";
import { endpointForward } from "../helpers/endpointForward.js";
import { Permissions } from "../helpers/permissions.js";
import {
    getUserPresenter,
    getUsersOfCommunityPresenter,
    getUsersOfRolePresenter,
} from "../presenters/userPresenter.js";
import { requireCommunityPermission } from "../security/permissionSecurity.js";
import { tokenSecurity } from "../security/tokenSecurity.js";
import { roleByIdValidator } from "../validators/roleValidators.js";
import {
    getUserByEmailValidator,
    getUserByIdValidator,
    getUserByUsernameValidator,
} from "../validators/userValidators.js";

const userRoutes = Router();

const parameterCommunityId = (request: Request): string | undefined => {
    const id = request.params.id;
    return Array.isArray(id) ? id[0] : id;
};
const readUsers = requireCommunityPermission("users", [Permissions.READ_OWN, Permissions.READ_OTHER]);

userRoutes.use(tokenSecurity);
userRoutes.get(
    "/get-user-by-id/:id",
    getUserByIdValidator,
    readUsers,
    getUserByIdHandler,
    getUserPresenter,
    endpointForward,
);
userRoutes.get(
    "/get-user-by-email/:email",
    getUserByEmailValidator,
    readUsers,
    getUserByEmailHandler,
    getUserPresenter,
    endpointForward,
);
userRoutes.get(
    "/get-user-by-username/:username",
    getUserByUsernameValidator,
    readUsers,
    getUserByUsernameHandler,
    getUserPresenter,
    endpointForward,
);
userRoutes.get(
    "/get-users-of-community/:id",
    getUserByIdValidator,
    requireCommunityPermission("users", [Permissions.READ_OWN, Permissions.READ_OTHER], parameterCommunityId),
    getCommunityUsersHandler,
    getUsersOfCommunityPresenter,
    endpointForward,
);
userRoutes.get(
    "/get-users-of-community-paginated/:id",
    getUserByIdValidator,
    requireCommunityPermission("users", [Permissions.READ_OWN, Permissions.READ_OTHER], parameterCommunityId),
    getCommunityUsersPaginatedHandler,
    getUsersOfCommunityPresenter,
    endpointForward,
);
userRoutes.get(
    "/get-users-of-role/:id",
    roleByIdValidator,
    readUsers,
    getRoleUsersHandler,
    getUsersOfRolePresenter,
    endpointForward,
);
userRoutes.get(
    "/get-users-of-role-paginated/:id",
    roleByIdValidator,
    readUsers,
    getRoleUsersPaginatedHandler,
    getUsersOfRolePresenter,
    endpointForward,
);

export { userRoutes };
