import Joi from "joi"

const communityByIdValidationScheme = Joi.object().keys({
    id: Joi.string().required().alphanum()
});

const createCommunityValidationScheme = Joi.object().keys({
    name: Joi.string().required(),
    flag: Joi.string().required().min(2).max(5),
    canUserViewOtherTasks: Joi.boolean().required(),
    canUserViewOtherTaskGroups: Joi.boolean().required(),
    canUserCreateTasks: Joi.boolean().required(),
    canUserCreateTaskGroups: Joi.boolean().required(),
    canUserEditTasks: Joi.boolean().required(),
    canUserSetTaskToComplete: Joi.boolean().required(),
    canUserSetTaskToIncomplete: Joi.boolean().required(),
    canUserEditTaskGroups: Joi.boolean().required(),
    canUserViewOtherProjects: Joi.boolean().required(),  
});

const updateCommunityValidationScheme = Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string(),
    ownerIds: Joi.array().items(Joi.string().alphanum()),
    userIds: Joi.array().items(Joi.string().alphanum()),
    projectIds: Joi.array().items(Joi.string().alphanum()),
    template: Joi.string(),
    permissions: Joi.object({
        canUserViewOtherTasks: Joi.boolean().required(),
        canUserViewOtherTaskGroups: Joi.boolean().required(),
        canUserCreateTasks: Joi.boolean().required(),
        canUserCreateTaskGroups: Joi.boolean().required(),
        canUserEditTasks: Joi.boolean().required(),
        canUserSetTaskToComplete: Joi.boolean().required(),
        canUserSetTaskToIncomplete: Joi.boolean().required(),
        canUserEditTaskGroups: Joi.boolean().required(),
        canUserViewOtherProjects: Joi.boolean().required(), 
    })  
});

export {
    communityByIdValidationScheme,
    createCommunityValidationScheme,
    updateCommunityValidationScheme
}