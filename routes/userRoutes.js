import express from 'express'
const userRoutes = express.Router();

import { communityByIdValidator } from '../validators/communityValidators.js';
import { 
    getCommunityUsersHandler, 
    getCommunityUsersPaginatedHandler, 
    getRoleUsersHandler, 
    getRoleUsersPaginatedHandler, 
    getUserByEmailHandler, 
    getUserByIdHandler,
    getUserByUsernameHandler
} from '../handlers/userHandler.js';
import { getCommunityUsersPresenter, getRoleUsersPresenter, getUserPresenter } from '../presenters/userPresenter.js';
import { userController } from '../controllers/userController.js';
import { getUserByEmailValidator, getUserByIdValidator, getUserByUsernameValidator } from '../validators/userValidators.js';
import { roleByIdValidator } from '../validators/roleValidators.js';
import { tokenSecurity } from '../security/tokenSecurity.js';

userRoutes.get(
    "/get-user-by-id/:id",
    tokenSecurity,
    getUserByIdValidator,
    getUserByIdHandler,
    getUserPresenter,
    userController,
);

userRoutes.get(
    "/get-user-by-email/:email",
    tokenSecurity,
    getUserByEmailValidator,
    getUserByEmailHandler,
    getUserPresenter,
    userController,
);

userRoutes.get(
    "/get-user-by-username/:id",
    tokenSecurity,
    getUserByUsernameValidator,
    getUserByUsernameHandler,
    getUserPresenter,
    userController,
);

userRoutes.get(
    "/get-users-of-community/:id",
    tokenSecurity,
    communityByIdValidator,
    getCommunityUsersHandler,
    getCommunityUsersPresenter,
    userController,
);

userRoutes.get(
    "/get-users-of-community-paginated/:id",
    tokenSecurity,
    communityByIdValidator,
    getCommunityUsersPaginatedHandler,
    getCommunityUsersPresenter,
    userController,
);

userRoutes.get(
    "/get-users-of-role/:id",
    tokenSecurity,
    roleByIdValidator,
    getRoleUsersHandler,
    getRoleUsersPresenter,
    userController,
);

userRoutes.get(
    "/get-users-of-role-paginated/:id",
    tokenSecurity,
    roleByIdValidator,
    getRoleUsersPaginatedHandler,
    getRoleUsersPresenter,
    userController,
);

export {
    userRoutes
}