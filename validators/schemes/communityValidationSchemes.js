import Joi from "joi"

const communityByIdValidationScheme = Joi.object().keys({
    id: Joi.string().required().alphanum()
});

export {
    communityByIdValidationScheme
}