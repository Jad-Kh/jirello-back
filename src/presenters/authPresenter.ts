import { createPresenter } from "../helpers/presenting.ts";
import { AuthSuccessResponses } from "../responses/success/AuthSuccessResponses.ts";
import { UserResponse } from "../models/user/UserResponse.ts";
import { RefreshTokenResponse } from "../models/auth/RefreshTokenResponse.ts";

export const registerPresenter = createPresenter(
    AuthSuccessResponses.REGISTER_SUCCESS,
    UserResponse,
    "user"
);

export const logInPresenter = createPresenter(
    AuthSuccessResponses.LOGIN_SUCCESS,
    UserResponse,
    "user"
);

export const signUpPresenter = createPresenter(
    AuthSuccessResponses.SIGNUP_SUCCESS,
    UserResponse,
    "user"
)

export const logoutPresenter = createPresenter(
    AuthSuccessResponses.LOGOUT_SUCCESS
);

export const refreshTokenPresenter = createPresenter(
    AuthSuccessResponses.REFRESH_TOKEN_SUCCESS,
    RefreshTokenResponse,
    "token"
);

export const recoveryPresenter = createPresenter(
    AuthSuccessResponses.RECOVERY_SUCCESS,
    UserResponse,
    "user"
)