import express from 'express'
const communityRoutes = express.Router();

import { 
    addProjectToCommunityValidator,
    addUserToCommunityValidator, 
    createCommunityValidator, 
    removeProjectFromCommunityValidator, 
    removeUserFromCommunityValidator, 
    updateCommunityValidator 
} from '../validators/communityValidators.js';
import { 
    addProjectToCommunityHandler,
    addUserToCommunityHandler, 
    createCommunityHandler, 
    removeProjectFromCommunityHandler, 
    removeUserFromCommunityHandler, 
    updateCommunityHandler 
} from '../handlers/communityHandler.js';
import { 
    addProjectToCommunityPresenter,
    addUserToCommunityPresenter, 
    createCommunityPresenter, 
    removeProjectFromCommunityPresenter, 
    removeUserFromCommunityPresenter, 
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

export {
    communityRoutes
}