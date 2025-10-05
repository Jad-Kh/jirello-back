import { createValidator } from "../helpers/validator.ts";
import { SignUpRequest } from "../handlers/auth/signUpHandler/signUpRequest.ts";
import { LogInRequest } from "../handlers/auth/logInHandler/logInRequest.ts";
import { RecoveryRequest } from "../handlers/auth/recoveryHandler/recoveryRequest.ts";
import { APISignature } from "../models/api/APISignature.ts";
import { AuthErrorResponses } from "../responses/errors/AuthErrorResponses.ts";
import { UserErrorResponses } from "../responses/errors/UserErrorResponses.ts";
import { AuthValidationSchemes } from "./schemes/authValidationScheme.ts";

export const signUpValidator = createValidator<SignUpRequest>(
    AuthValidationSchemes.signUpValidationScheme,
    AuthErrorResponses.SIGNUP_VALIDATION_ERROR
);

export const logInValidator = createValidator<LogInRequest>(
    AuthValidationSchemes.logInValidationScheme,
    AuthErrorResponses.LOGIN_VALIDATION_ERROR
);

export const recoveryValidator = createValidator<RecoveryRequest>(
    AuthValidationSchemes.recoveryValidationScheme,
    AuthErrorResponses.INVALID_EMAIL
);

export const refreshTokenValidator = createValidator<APISignature>(
    AuthValidationSchemes.refreshTokenValidationScheme,
    UserErrorResponses.USER_NOT_FOUND,
    true
);

export const logoutValidator = createValidator<APISignature>(
    AuthValidationSchemes.logoutValidationScheme,
    UserErrorResponses.USER_NOT_FOUND,
    true
);