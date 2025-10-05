"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityErrorResponses = void 0;
const CommunityErrorResponses = {
    ID_ERROR: {
        message: 'Community not found or Id does not exist',
        code: 404
    },
    COMMUNITY_NAME_ALREADY_EXISTS: {
        message: 'Community name already taken',
        code: 400
    },
    COMMUNITY_FLAG_ALREADY_EXISTS: {
        message: 'Community flag already taken',
        code: 400
    },
    COMMUNITY_NOT_FOUND: {
        message: "No community with this id exists",
        code: 404
    },
    CREATION_ERROR: {
        message: "Error creating community",
        code: 400
    },
    UPDATE_ERROR: {
        message: "Error updating community",
        code: 400
    },
    COMMUNITY_USER_ADDING_ERROR: {
        message: "Error adding user to communnity",
        code: 400
    },
    COMMUNITY_USER_REMOVING_ERROR: {
        message: "Error removing user from community",
        code: 400
    },
    COMMUNITY_USER_FOUND: {
        message: "User is already part of this community",
        code: 400
    },
    COMMUNITY_USER_NOT_FOUND: {
        message: "User is not part of this community",
        code: 404
    }
};
exports.CommunityErrorResponses = CommunityErrorResponses;
