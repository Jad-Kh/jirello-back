import express from 'express'
const communityRoutes = express.Router();

import { 
    addUserToCommunityValidator, 
    createCommunityValidator, 
    removeUserFromCommunityValidator, 
    updateCommunityValidator 
} from '../validators/communityValidators.js';
import { 
    addUserToCommunityHandler, 
    createCommunityHandler, 
    removeUserFromCommunityHandler, 
    updateCommunityHandler 
} from '../handlers/communityHandler.js';
import { 
    addUserToCommunityPresenter, 
    createCommunityPresenter, 
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

export {
    communityRoutes
}