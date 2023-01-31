import express from 'express'
const authRoutes = express.Router();

import { signUpValidator } from '../validators/authValidators.js';
import { signUpHandler } from '../handlers/authHandler.js';
import { signUpSecurity } from '../security/authSecurity.js';
import { signUpPresenter } from '../presenters/authPresenter.js';
import { authController } from '../controllers/authController.js';

authRoutes.post(
    "/sign-up",
    signUpValidator,
    signUpHandler,
    signUpSecurity,
    signUpPresenter,
    authController,
);

export {
    authRoutes
}