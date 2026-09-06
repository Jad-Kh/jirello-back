import { createPresenter } from "../helpers/presenting.js";
import { AuthResponse } from "../models/auth/AuthResponse.js";
import { RefreshTokenResponse } from "../models/auth/RefreshTokenResponse.js";
import { AuthSuccessResponses } from "../responses/success/AuthSuccessResponses.js";

export const logInPresenter = createPresenter(AuthSuccessResponses.LOGIN_SUCCESS, AuthResponse, "auth");

export const signUpPresenter = createPresenter(AuthSuccessResponses.SIGNUP_SUCCESS, AuthResponse, "auth");

export const logoutPresenter = createPresenter(AuthSuccessResponses.LOGOUT_SUCCESS);

export const refreshTokenPresenter = createPresenter(
    AuthSuccessResponses.REFRESH_TOKEN_SUCCESS,
    RefreshTokenResponse,
    "token",
);

export const recoveryPresenter = createPresenter(AuthSuccessResponses.RECOVERY_SUCCESS);
