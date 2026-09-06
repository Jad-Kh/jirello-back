import { Router } from "express";
import { logInHandler } from "../handlers/auth/logInHandler/logInHandler.js";
import { logOutHandler } from "../handlers/auth/logOutHandler/logOutHandler.js";
import { recoveryHandler, resetPasswordHandler } from "../handlers/auth/recoveryHandler/recoveryHandler.js";
import { refreshTokenHandler } from "../handlers/auth/refreshTokenHandler/refreshTokenHandler.js";
import { signUpHandler } from "../handlers/auth/signUpHandler/signUpHandler.js";
import { endpointForward } from "../helpers/endpointForward.js";
import {
    logInPresenter,
    logoutPresenter,
    refreshTokenPresenter,
    signUpPresenter,
} from "../presenters/authPresenter.js";
import { parseUsernameOrEmailSecurity } from "../security/authSecurity.js";
import { authenticationRateLimit, recoveryRateLimit } from "../security/rateLimitSecurity.js";
import { tokenSecurity } from "../security/tokenSecurity.js";
import {
    logInValidator,
    recoveryValidator,
    resetPasswordValidator,
    signUpValidator,
} from "../validators/authValidators.js";

const authRoutes = Router();

authRoutes.post(
    "/sign-up",
    authenticationRateLimit,
    signUpValidator,
    signUpHandler,
    signUpPresenter,
    endpointForward,
);
authRoutes.post(
    "/log-in",
    authenticationRateLimit,
    parseUsernameOrEmailSecurity,
    logInValidator,
    logInHandler,
    logInPresenter,
    endpointForward,
);
authRoutes.post(
    "/refresh-token",
    authenticationRateLimit,
    refreshTokenHandler,
    refreshTokenPresenter,
    endpointForward,
);
authRoutes.post("/log-out", tokenSecurity, logOutHandler, logoutPresenter, endpointForward);
authRoutes.post("/recovery-email", recoveryRateLimit, recoveryValidator, recoveryHandler);
authRoutes.post("/reset-password", recoveryRateLimit, resetPasswordValidator, resetPasswordHandler);

export { authRoutes };
