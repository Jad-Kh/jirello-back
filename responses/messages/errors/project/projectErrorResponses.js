const ProjectErrorResponses = {

    CREATION_ERROR: { 
        message: 'Error creating project', 
        code: 400 
    },
    PROJECT_NAME_ALREADY_EXISTS: {
        message: 'Project with this name already exists in this community',
        code: 400
    }
}

export {
    ProjectErrorResponses
};