import { CommonErrorResponses } from "./common/commonErrorResponse.js";
import { UserErrorResponses } from "./user/userErrorResponse.js";
import { AuthErrorResponses } from "./auth/authErrorResponses.js";
import { CommunityErrorResponses } from "./community/communityErrorResponse.js";

const ErrorResponses = {
    ...CommonErrorResponses,
    ...UserErrorResponses,
    ...AuthErrorResponses,
    ...CommunityErrorResponses
}

export {
    ErrorResponses,
};