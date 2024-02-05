import express from 'express'
const authRoutes = express.Router();

import {
    signUpValidator,
    logInValidator,
    recoveryValidator,
    refreshTokenValidator, logoutValidator
} from '../validators/authValidators.js';
import {
    signUpHandler,
    logInHandler,
    recoveryHandler,
    refreshTokenHandler, logoutHandler
} from '../handlers/authHandler.js';
import { signUpSecurity, logInSecurity } from '../security/authSecurity.js';
import {
    signUpPresenter,
    logInPresenter,
    recoveryPresenter,
    refreshTokenPresenter, logoutPresenter
} from '../presenters/authPresenter.js';
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

authRoutes.get(
    "/recovery-email",
    recoveryValidator,
    recoveryHandler,
    recoveryPresenter,
    authController,
);

authRoutes.post(
    "/refresh-token",
    refreshTokenValidator,
    refreshTokenHandler,
    refreshTokenPresenter,
    authController,
);

authRoutes.post(
    "/log-out",
    logoutValidator,
    logoutHandler,
    logoutPresenter,
    authController,
);

export {
    authRoutes
}