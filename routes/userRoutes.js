import express from 'express'
const userRoutes = express.Router();

import { communityByIdValidator } from '../validators/communityValidators.js';
import { 
    getCommunityUsersHandler, 
    getCommunityUsersPaginatedHandler 
} from '../handlers/userHandler.js';
import { getCommunityUsersPresenter } from '../presenters/userPresenter.js';
import { userController } from '../controllers/userController.js';

userRoutes.get(
    "/get-users-of-community/:id",
    communityByIdValidator,
    getCommunityUsersHandler,
    getCommunityUsersPresenter,
    userController,
);

userRoutes.get(
    "/get-users-of-community-paginated/:id",
    communityByIdValidator,
    getCommunityUsersPaginatedHandler,
    getCommunityUsersPresenter,
    userController,
);

export {
    userRoutes
}