import express from 'express'
const communityRoutes = express.Router();

import { 
    addProjectToCommunityValidator,
    addUserToCommunityValidator, 
    createCommunityValidator, 
    removeProjectFromCommunityValidator, 
    removeUserFromCommunityValidator, 
    updateCommunityPermissionsValidator, 
    updateCommunityValidator 
} from '../validators/communityValidators.js';
import { 
    addProjectToCommunityHandler,
    addUserToCommunityHandler, 
    createCommunityHandler, 
    removeProjectFromCommunityHandler, 
    removeUserFromCommunityHandler, 
    updateCommunityHandler, 
    updateCommunityPermissionsHandler
} from '../handlers/communityHandler.js';
import { 
    addProjectToCommunityPresenter,
    addUserToCommunityPresenter, 
    createCommunityPresenter, 
    removeProjectFromCommunityPresenter, 
    removeUserFromCommunityPresenter, 
    updateCommunityPermissionsPresenter, 
    updateCommunityPresenter 
} from '../presenters/communityPresenter.js';
import { communityController } from '../controllers/communityController.js';
import { tokenSecurity } from '../security/tokenSecurity.js';

communityRoutes.post(
    "/create-community",
    tokenSecurity,
    createCommunityValidator,
    createCommunityHandler,
    createCommunityPresenter,
    communityController,
);

communityRoutes.put(
    "/update-community",
    tokenSecurity,
    updateCommunityValidator,
    updateCommunityHandler,
    updateCommunityPresenter,
    communityController,
);

communityRoutes.put(
    "/add-user-to-community",
    tokenSecurity,
    addUserToCommunityValidator,
    addUserToCommunityHandler,
    addUserToCommunityPresenter,
    communityController,
);

communityRoutes.put(
    "/remove-user-from-community",
    tokenSecurity,
    removeUserFromCommunityValidator,
    removeUserFromCommunityHandler,
    removeUserFromCommunityPresenter,
    communityController,
);

communityRoutes.put(
    "/add-project-to-community",
    tokenSecurity,
    addProjectToCommunityValidator,
    addProjectToCommunityHandler,
    addProjectToCommunityPresenter,
    communityController,
);

communityRoutes.put(
    "/remove-project-from-community",
    tokenSecurity,
    removeProjectFromCommunityValidator,
    removeProjectFromCommunityHandler,
    removeProjectFromCommunityPresenter,
    communityController,
);

communityRoutes.put(
    "/update-community-permissions",
    tokenSecurity,
    updateCommunityPermissionsValidator,
    updateCommunityPermissionsHandler,
    updateCommunityPermissionsPresenter,
    communityController,
);

export {
    communityRoutes
}