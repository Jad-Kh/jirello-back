import { createPresenter } from "../helpers/presenting";
import { CommunitySuccessResponses } from "../responses/success/CommunitySuccessResponses.ts";
import { CommunityResponse } from "../models/community/CommunityResponse.ts";
import { CommunitiesOfUserResponse } from "../models/community/CommunitiesOfUserResponse.ts";

export const createCommunityPresenter = createPresenter(
    CommunitySuccessResponses.CREATE_COMMUNITY_SUCCESS,
    CommunityResponse,
    "community"
);

export const updateCommunityPresenter = createPresenter(
    CommunitySuccessResponses.UPDATE_COMMUNITY_SUCCESS,
    CommunityResponse,
    "community"
);

export const updateCommunityPermissionsPresenter = createPresenter(
    CommunitySuccessResponses.ADD_PROJECT_TO_COMMUNITY_SUCCESS,
    CommunityResponse,
    "community"
);

export const addUserToCommunityPresenter = createPresenter(
    CommunitySuccessResponses.ADD_USER_TO_COMMUNITY_SUCCESS
);

export const removeUserFromCommunityPresenter = createPresenter(
    CommunitySuccessResponses.REMOVE_USER_FROM_COMMUNITY_SUCCESS
);

export const addProjectToCommunityPresenter = createPresenter(
    CommunitySuccessResponses.ADD_PROJECT_TO_COMMUNITY_SUCCESS
);

export const removeProjectFromCommunityPresenter = createPresenter(
    CommunitySuccessResponses.REMOVE_PROJECT_FROM_COMMUNITY_SUCCESS
);

export const getUserCommunitiesPresenter = createPresenter(
    CommunitySuccessResponses.COMMUNITIES_OF_USER_SUCCESS,
    CommunitiesOfUserResponse,
    "communities",
    true
);
