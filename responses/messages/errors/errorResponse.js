import { CommonErrorResponses } from "./common/commonErrorResponse.js";
import { UserErrorResponses } from "./user/userErrorResponse.js";

const ErrorResponses = {
    ...CommonErrorResponses,
    ...UserErrorResponses,
}

export {
    ErrorResponses,
};