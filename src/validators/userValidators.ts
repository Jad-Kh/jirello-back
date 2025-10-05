import { createValidator } from "../helpers/validator.ts";
import { APISignature } from "../models/api/APISignature.ts";
import { GetUserByEmailRequest } from "../handlers/user/getUserByEmailHandler/getUserByEmailRequest.ts";
import { GetUserByUsernameRequest } from "../handlers/user/getUserByUsernameHandler/getUserByUsernameRequest.ts";
import { UserErrorResponses } from "../responses/errors/UserErrorResponses.ts";
import { UserValidationSchemes } from "./schemes/userValidationSchemes.ts";

export const getUserByIdValidator = createValidator<APISignature>(
    UserValidationSchemes.getUserByIdValidationScheme,
    UserErrorResponses.USER_NOT_FOUND,
    true
);

export const getUserByEmailValidator = createValidator<GetUserByEmailRequest>(
    UserValidationSchemes.getUserByEmailValidationScheme,
    UserErrorResponses.EMAIL_ERROR
);

export const getUserByUsernameValidator = createValidator<GetUserByUsernameRequest>(
    UserValidationSchemes.getUserByUsernameValidationScheme,
    UserErrorResponses.USERNAME_NOT_FOUND
);