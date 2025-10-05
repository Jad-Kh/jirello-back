"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectErrorResponses = void 0;
const ProjectErrorResponses = {
    CREATION_ERROR: {
        message: 'Error creating project',
        code: 400
    },
    PROJECT_NAME_ALREADY_EXISTS: {
        message: 'Project with this name already exists in this community',
        code: 400
    },
    PROJECT_NOT_FOUND: {
        message: 'Project id not found',
        code: 404
    },
    PROJECT_UPDATE_ERROR: {
        message: 'Error updating project',
        code: 400
    }
};
exports.ProjectErrorResponses = ProjectErrorResponses;
