import { Router, RequestHandler } from 'express'
import { signUpValidator } from "../validators/authValidators.js";
import { signUpHandler } from "../handlers/auth/signUpHandler/signUpHandler.js";
import { authSecurity } from "../security/authSecurity.js";
import { signUpPresenter } from "../presenters/authPresenter.js";
import { endpointForward } from "../helpers/endpointForward.js";

const authRoutes = Router();

const signUpChain: RequestHandler[] = [
    signUpValidator,
    signUpHandler,
    authSecurity,
    signUpPresenter,
    endpointForward
];

authRoutes.post("/sign-up", ...signUpChain);

export { authRoutes };