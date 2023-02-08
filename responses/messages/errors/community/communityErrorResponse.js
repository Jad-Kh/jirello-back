const CommunityErrorResponses = {

    ID_ERROR: { 
        message: 'Community not found or Id does not exist', 
        code: 404 
    },
    COMMUNITY_NOT_FOUND: {
        message: "No community with this id exists",
        code: 404
    }
}

export {
    CommunityErrorResponses
};