import { GetUserByEmailRequest } from "../handlers/user/getUserByEmailHandler/getUserByEmailRequest.js";
import { GetUserByUsernameRequest } from "../handlers/user/getUserByUsernameHandler/getUserByUsernameRequest.js";
import { createValidator } from "../helpers/validator.js";
import { APISignature } from "../models/api/APISignature.js";
import { UserErrorResponses } from "../responses/errors/UserErrorResponses.js";
import { UserValidationSchemes } from "./schemes/userValidationSchemes.js";

export const getUserByIdValidator = createValidator<APISignature>(
    UserValidationSchemes.getUserByIdValidationScheme,
    UserErrorResponses.USER_NOT_FOUND,
    true,
);

export const getUserByEmailValidator = createValidator<GetUserByEmailRequest>(
    UserValidationSchemes.getUserByEmailValidationScheme,
    UserErrorResponses.EMAIL_ERROR,
);

export const getUserByUsernameValidator = createValidator<GetUserByUsernameRequest>(
    UserValidationSchemes.getUserByUsernameValidationScheme,
    UserErrorResponses.USERNAME_NOT_FOUND,
);
