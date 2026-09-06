import { Request, Router } from "express";
import { addProjectToCommunityHandler } from "../handlers/community/addProjectToCommunityHandler/addProjectToCommunityHandler.js";
import { addUserToCommunityHandler } from "../handlers/community/addUserToCommunityHandler/addUserToCommunityHandler.js";
import { createCommunityHandler } from "../handlers/community/createCommunityHandler/createCommunityHandler.js";
import { getUserCommunitiesHandler } from "../handlers/community/getUserCommunitiesHandler/getUserCommunitiesHandler.js";
import { getUserCommunitiesPaginatedHandler } from "../handlers/community/getUserCommunitiesPaginatedHandler/getUserCommunitiesPaginatedHandler.js";
import { removeProjectFromCommunityHandler } from "../handlers/community/removeProjectFromCommunityHandler/removeProjectFromCommunityHandler.js";
import { removeUserFromCommunityHandler } from "../handlers/community/removeUserFromCommunityHandler/removeUserFromCommunityHandler.js";
import { updateCommunityHandler } from "../handlers/community/updateCommunityHandler/updateCommunityHandler.js";
import { updateCommunityPermissionsHandler } from "../handlers/community/updateCommunityPermissionsHandler/updateCommunityPermissionsHandler.js";
import { endpointForward } from "../helpers/endpointForward.js";
import { Permissions } from "../helpers/permissions.js";
import {
    addProjectToCommunityPresenter,
    addUserToCommunityPresenter,
    createCommunityPresenter,
    getUserCommunitiesPresenter,
    removeProjectFromCommunityPresenter,
    removeUserFromCommunityPresenter,
    updateCommunityPermissionsPresenter,
    updateCommunityPresenter,
} from "../presenters/communityPresenter.js";
import { requireCommunityPermission, requireSelf } from "../security/permissionSecurity.js";
import { tokenSecurity } from "../security/tokenSecurity.js";
import {
    addProjectToCommunityValidator,
    addUserToCommunityValidator,
    createCommunityValidator,
    removeProjectFromCommunityValidator,
    removeUserFromCommunityValidator,
    updateCommunityPermissionsValidator,
    updateCommunityValidator,
} from "../validators/communityValidators.js";
import { getUserByIdValidator } from "../validators/userValidators.js";

const communityRoutes = Router();

const bodyCommunityId = (request: Request): string | undefined => request.body?.communityId;

const parameterCommunityId = (request: Request): string | undefined => {
    const id = request.params.id;
    return Array.isArray(id) ? id[0] : id;
};

communityRoutes.use(tokenSecurity);

communityRoutes.post(
    "/create-community",
    createCommunityValidator,
    createCommunityHandler,
    createCommunityPresenter,
    endpointForward,
);
communityRoutes.put(
    "/update-community/:id",
    updateCommunityValidator,
    requireCommunityPermission(
        "communities",
        [Permissions.EDIT_OWN, Permissions.EDIT_OTHER],
        parameterCommunityId,
    ),
    updateCommunityHandler,
    updateCommunityPresenter,
    endpointForward,
);
communityRoutes.put(
    "/update-community-permissions/:id",
    updateCommunityPermissionsValidator,
    requireCommunityPermission("communities", [Permissions.CHANGE_OTHER], parameterCommunityId),
    updateCommunityPermissionsHandler,
    updateCommunityPermissionsPresenter,
    endpointForward,
);
communityRoutes.put(
    "/add-user-to-community",
    addUserToCommunityValidator,
    requireCommunityPermission("users", [Permissions.CHANGE_OTHER], bodyCommunityId),
    addUserToCommunityHandler,
    addUserToCommunityPresenter,
    endpointForward,
);
communityRoutes.put(
    "/remove-user-from-community",
    removeUserFromCommunityValidator,
    requireCommunityPermission("users", [Permissions.CHANGE_OTHER], bodyCommunityId),
    removeUserFromCommunityHandler,
    removeUserFromCommunityPresenter,
    endpointForward,
);
communityRoutes.put(
    "/add-project-to-community",
    addProjectToCommunityValidator,
    requireCommunityPermission("projects", [Permissions.CHANGE_OTHER], bodyCommunityId),
    addProjectToCommunityHandler,
    addProjectToCommunityPresenter,
    endpointForward,
);
communityRoutes.put(
    "/remove-project-from-community",
    removeProjectFromCommunityValidator,
    requireCommunityPermission("projects", [Permissions.CHANGE_OTHER], bodyCommunityId),
    removeProjectFromCommunityHandler,
    removeProjectFromCommunityPresenter,
    endpointForward,
);
communityRoutes.get(
    "/get-user-communities/:id",
    getUserByIdValidator,
    requireSelf,
    getUserCommunitiesHandler,
    getUserCommunitiesPresenter,
    endpointForward,
);
communityRoutes.get(
    "/get-user-communities-paginated/:id",
    getUserByIdValidator,
    requireSelf,
    getUserCommunitiesPaginatedHandler,
    getUserCommunitiesPresenter,
    endpointForward,
);

export { communityRoutes };
