import { AddProjectToCommunityRequest } from "../handlers/community/addProjectToCommunityHandler/addProjectToCommunityRequest.js";
import { AddUserToCommunityRequest } from "../handlers/community/addUserToCommunityHandler/addUserToCommunityRequest.js";
import { CommunityRequest } from "../handlers/community/createCommunityHandler/createCommunityRequest.js";
import { RemoveProjectFromCommunityRequest } from "../handlers/community/removeProjectFromCommunityHandler/removeProjectFromCommunityRequest.js";
import { RemoveUserFromCommunityRequest } from "../handlers/community/removeUserFromCommunityHandler/removeUserFromCommunityRequest.js";
import { UpdateCommunityRequest } from "../handlers/community/updateCommunityHandler/updateCommunityRequest.js";
import { UpdateCommunityPermissionsRequest } from "../handlers/community/updateCommunityPermissionsHandler/updateCommunityPermissionsRequest.js";
import { createValidator } from "../helpers/validator.js";
import { CommonErrorResponses } from "../responses/errors/CommonErrorResponses.js";
import { CommunityErrorResponses } from "../responses/errors/CommunityErrorResponses.js";
import { CommunityValidationSchemes } from "./schemes/communityValidationSchemes.js";

export const createCommunityValidator = createValidator<CommunityRequest>(
    CommunityValidationSchemes.createCommunityValidationScheme,
    CommunityErrorResponses.CREATION_ERROR,
);

export const updateCommunityValidator = createValidator<UpdateCommunityRequest>(
    CommunityValidationSchemes.updateCommunityValidationScheme,
    CommunityErrorResponses.UPDATE_ERROR,
    true,
);

export const addUserToCommunityValidator = createValidator<AddUserToCommunityRequest>(
    CommunityValidationSchemes.addUserToCommunityValidationScheme,
    CommunityErrorResponses.COMMUNITY_USER_ADDING_ERROR,
);

export const removeUserFromCommunityValidator = createValidator<RemoveUserFromCommunityRequest>(
    CommunityValidationSchemes.removeUserFromCommunityValidationScheme,
    CommunityErrorResponses.COMMUNITY_USER_REMOVING_ERROR,
);

export const addProjectToCommunityValidator = createValidator<AddProjectToCommunityRequest>(
    CommunityValidationSchemes.addProjectToCommunityValidationScheme,
    CommonErrorResponses.REQUIRED,
);

export const removeProjectFromCommunityValidator = createValidator<RemoveProjectFromCommunityRequest>(
    CommunityValidationSchemes.addProjectToCommunityValidationScheme,
    CommonErrorResponses.REQUIRED,
);

export const updateCommunityPermissionsValidator = createValidator<UpdateCommunityPermissionsRequest>(
    CommunityValidationSchemes.updateCommunityPermissionsValidationScheme,
    CommonErrorResponses.REQUIRED,
    true,
);
