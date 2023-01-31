import express from 'express'
const authRoutes = express.Router();

import { signUpValidator } from '../validators/authValidators.js';
import { signUpHandler } from '../handlers/authHandler.js';
import { signUpSecurity } from '../security/authSecurity.js';
import { signUpPresenter } from '../presenters/authPresenter.js';
import { authController } from '../controllers/authController.js';
import { tokenSecurity } from '../security/tokenSecurity.js';

authRoutes.post(
    "/sign-up",
    signUpValidator,
    signUpHandler,
    signUpSecurity,
    signUpPresenter,
    authController,
);

authRoutes.get(
    "/token-test",
    tokenSecurity
);

export {
    authRoutes
}