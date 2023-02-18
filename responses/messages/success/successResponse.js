import { AuthSuccessResponses } from "./auth/authSuccessResponses.js";
import { UserSuccessResponses } from "./user/userSuccessResponses.js";
import { CommunitySuccessResponses } from "./community/communitySuccessResponses.js";

const SuccessResponses = {
    ...AuthSuccessResponses,
    ...UserSuccessResponses,
    ...CommunitySuccessResponses
}

export {
    SuccessResponses
}