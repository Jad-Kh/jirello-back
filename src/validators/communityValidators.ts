import { createValidator } from "../helpers/validator.ts";
import { CommunityRequest } from "../handlers/community/createCommunityHandler/createCommunityRequest.ts";
import { UpdateCommunityRequest } from "../handlers/community/updateCommunityHandler/updateCommunityRequest.ts";
import { AddUserToCommunityRequest } from "../handlers/community/addUserToCommunityHandler/addUserToCommunityRequest.ts";
import { RemoveUserFromCommunityRequest } from "../handlers/community/removeUserFromCommunityHandler/removeUserFromCommunityRequest.ts";
import { AddProjectToCommunityRequest } from "../handlers/community/addProjectToCommunityHandler/addProjectToCommunityRequest.ts";
import { RemoveProjectFromCommunityRequest } from "../handlers/community/removeProjectFromCommunityHandler/removeProjectFromCommunityRequest.ts";
import { UpdateCommunityPermissionsRequest } from "../handlers/community/updateCommunityPermissionsHandler/updateCommunityPermissionsRequest.ts";
import { CommunityErrorResponses } from "../responses/errors/CommunityErrorResponses.ts";
import { CommonErrorResponses } from "../responses/errors/CommonErrorResponses.ts";
import { CommunityValidationSchemes } from "./schemes/communityValidationSchemes.ts";

export const createCommunityValidator = createValidator<CommunityRequest>(
    CommunityValidationSchemes.createCommunityValidationScheme,
    CommunityErrorResponses.CREATION_ERROR
);

export const updateCommunityValidator = createValidator<UpdateCommunityRequest>(
    CommunityValidationSchemes.updateCommunityValidationScheme,
    CommunityErrorResponses.UPDATE_ERROR,
    true
);

export const addUserToCommunityValidator = createValidator<AddUserToCommunityRequest>(
    CommunityValidationSchemes.addUserToCommunityValidationScheme,
    CommunityErrorResponses.COMMUNITY_USER_ADDING_ERROR,
    true
);

export const removeUserFromCommunityValidator = createValidator<RemoveUserFromCommunityRequest>(
    CommunityValidationSchemes.removeUserFromCommunityValidationScheme,
    CommunityErrorResponses.COMMUNITY_USER_REMOVING_ERROR,
    true
);

export const addProjectToCommunityValidator = createValidator<AddProjectToCommunityRequest>(
    CommunityValidationSchemes.addProjectToCommunityValidationScheme,
    CommonErrorResponses.REQUIRED,
    true
);

export const removeProjectFromCommunityValidator = createValidator<RemoveProjectFromCommunityRequest>(
    CommunityValidationSchemes.addProjectToCommunityValidationScheme,
    CommonErrorResponses.REQUIRED,
    true
);

export const updateCommunityPermissionsValidator = createValidator<UpdateCommunityPermissionsRequest>(
    CommunityValidationSchemes.updateCommunityPermissionsValidationScheme,
    CommonErrorResponses.REQUIRED,
    true
);