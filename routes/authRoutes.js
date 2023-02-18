import express from 'express'
const authRoutes = express.Router();

import { signUpValidator, logInValidator } from '../validators/authValidators.js';
import { signUpHandler, logInHandler} from '../handlers/authHandler.js';
import { signUpSecurity, logInSecurity } from '../security/authSecurity.js';
import { signUpPresenter, logInPresenter } from '../presenters/authPresenter.js';
import { authController } from '../controllers/authController.js';

authRoutes.post(
    "/sign-up",
    signUpValidator,
    signUpHandler,
    signUpSecurity,
    signUpPresenter,
    authController,
);

authRoutes.post(
    "/log-in",
    logInValidator,
    logInHandler,
    logInSecurity,
    logInPresenter,
    authController,
);

export {
    authRoutes
}