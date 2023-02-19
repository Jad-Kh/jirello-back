import { AuthSuccessResponses } from "./auth/authSuccessResponses.js";
import { UserSuccessResponses } from "./user/userSuccessResponses.js";
import { CommunitySuccessResponses } from "./community/communitySuccessResponses.js";
import { ProjectErrorResponses } from "../errors/project/projectErrorResponses.js";

const SuccessResponses = {
    ...AuthSuccessResponses,
    ...UserSuccessResponses,
    ...CommunitySuccessResponses,
    ...ProjectErrorResponses
}

export {
    SuccessResponses
}