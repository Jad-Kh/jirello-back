import Joi from "joi"

const communityByIdValidationScheme = Joi.object().keys({
    id: Joi.string().required().alphanum()
});

const createCommunityValidationScheme = Joi.object().keys({
    name: Joi.string().required(),
    flag: Joi.string().required().min(2).max(5),
    tasks: Joi.array().required(),
    taskGroups: Joi.array().required(),
    meetings: Joi.array().required(),
    projects: Joi.array().required(),
    screens: Joi.array().required(),
    roles: Joi.array().required(), 
});

const updateCommunityValidationScheme = Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string(),
    ownerIds: Joi.array().items(Joi.string().alphanum()),
    userIds: Joi.array().items(Joi.string().alphanum()),
    projectIds: Joi.array().items(Joi.string().alphanum()),
    template: Joi.string(),
    permissions: Joi.object({
        tasks: Joi.array().required(),
        taskGroups: Joi.array().required(),
        meetings: Joi.array().required(),
        projects: Joi.array().required(),
        screens: Joi.array().required(),
        roles: Joi.array().required(), 
    })  
});

const addUserToCommunityValidationScheme = Joi.object().keys({
    communityId: Joi.string().required().alphanum(),
    userId: Joi.string().required().alphanum(),
});

const removeUserFromCommunityValidationScheme = Joi.object().keys({
    communityId: Joi.string().required().alphanum(),
    userId: Joi.string().required().alphanum(),    
});

export {
    communityByIdValidationScheme,
    createCommunityValidationScheme,
    updateCommunityValidationScheme,
    addUserToCommunityValidationScheme,
    removeUserFromCommunityValidationScheme
}