import express from 'express'
const userRoutes = express.Router();

import { communityByIdValidator } from '../validators/communityValidators.js';
import { getCommunityUsersHandler } from '../handlers/userHandler.js';
import { getCommunityUsersPresenter } from '../presenters/userPresenter.js';
import { userController } from '../controllers/userController.js';

userRoutes.get(
    "/get-users-of-community/:id",
    communityByIdValidator,
    getCommunityUsersHandler,
    getCommunityUsersPresenter,
    userController,
);


export {
    authRoutes
}