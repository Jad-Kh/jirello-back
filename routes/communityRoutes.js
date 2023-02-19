import express from 'express'
const communityRoutes = express.Router();

import { createCommunityValidator, updateCommunityValidator } from '../validators/communityValidators.js';
import { createCommunityHandler, updateCommunityHandler } from '../handlers/communityHandler.js';
import { createCommunityPresenter, updateCommunityPresenter } from '../presenters/communityPresenter.js';
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

export {
    communityRoutes
}