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
}

export {
    CommunityErrorResponses
};