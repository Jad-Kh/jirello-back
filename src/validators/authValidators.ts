import { LogInRequest } from "../handlers/auth/logInHandler/logInRequest.js";
import { RecoveryRequest, ResetPasswordRequest } from "../handlers/auth/recoveryHandler/recoveryRequest.js";
import { SignUpRequest } from "../handlers/auth/signUpHandler/signUpRequest.js";
import { createValidator } from "../helpers/validator.js";
import { APISignature } from "../models/api/APISignature.js";
import { AuthErrorResponses } from "../responses/errors/AuthErrorResponses.js";
import { UserErrorResponses } from "../responses/errors/UserErrorResponses.js";
import { AuthValidationSchemes } from "./schemes/authValidationScheme.js";

export const signUpValidator = createValidator<SignUpRequest>(
    AuthValidationSchemes.signUpValidationScheme,
    AuthErrorResponses.SIGNUP_VALIDATION_ERROR,
);

export const logInValidator = createValidator<LogInRequest>(
    AuthValidationSchemes.logInValidationScheme,
    AuthErrorResponses.LOGIN_VALIDATION_ERROR,
);

export const recoveryValidator = createValidator<RecoveryRequest>(
    AuthValidationSchemes.recoveryValidationScheme,
    AuthErrorResponses.INVALID_EMAIL,
);

export const resetPasswordValidator = createValidator<ResetPasswordRequest>(
    AuthValidationSchemes.resetPasswordValidationScheme,
    AuthErrorResponses.INVALID_EMAIL,
);

export const refreshTokenValidator = createValidator<APISignature>(
    AuthValidationSchemes.refreshTokenValidationScheme,
    UserErrorResponses.USER_NOT_FOUND,
    true,
);

export const logoutValidator = createValidator<APISignature>(
    AuthValidationSchemes.logoutValidationScheme,
    UserErrorResponses.USER_NOT_FOUND,
    true,
);
