import { CommonErrorResponses } from "./common/commonErrorResponse.js";
import { UserErrorResponses } from "./user/userErrorResponse.js";
import { AuthErrorResponses } from "./auth/authErrorResponses.js";

const ErrorResponses = {
    ...CommonErrorResponses,
    ...UserErrorResponses,
    ...AuthErrorResponses
}

export {
    ErrorResponses,
};