import express from 'express'
const communityRoutes = express.Router();

import { createCommunityValidator } from '../validators/communityValidators.js';
import { createCommunityHandler } from '../handlers/communityHandler.js';
import { createCommunityPresenter } from '../presenters/communityPresenter.js';
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

export {
    communityRoutes
}