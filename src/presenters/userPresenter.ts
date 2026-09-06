import { createPresenter } from "../helpers/presenting.js";
import { UserResponse } from "../models/user/UserResponse.js";
import { UsersOfCommunityResponse } from "../models/user/UsersOfCommunityResponse.js";
import { UsersOfEntityResponse } from "../models/user/UsersOfEntityResponse.js";
import { UserSuccessResponses } from "../responses/success/UserSuccessResponses.js";

export const getUserPresenter = createPresenter(UserSuccessResponses.GET_USER_SUCCESS, UserResponse, "user");

export const updateUserPresenter = createPresenter(
    UserSuccessResponses.UPDATE_USER_SUCCESS,
    UserResponse,
    "user",
);

export const deleteUserPresenter = createPresenter(
    UserSuccessResponses.DELETE_USER_SUCCESS,
    UserResponse,
    "user",
);

export const getUsersOfCommunityPresenter = createPresenter(
    UserSuccessResponses.USERS_OF_COMMUNITY_SUCCESS,
    UsersOfCommunityResponse,
    "users",
    true,
);

export const getUsersOfRolePresenter = createPresenter(
    UserSuccessResponses.USERS_OF_ROLE_SUCCESS,
    UsersOfEntityResponse,
    "users",
    true,
);
