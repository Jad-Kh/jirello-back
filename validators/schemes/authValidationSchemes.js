import Joi from "joi"
import { 
    emailValidation,
    passwordValidation,
    dateValidation 
} from "../validations/common/commonValidations.js";

const signUpValidationScheme = Joi.object().keys({
    username: Joi.string().required().max(30).min(2),
    email: Joi.string().required().custom(emailValidation),
    firstName: Joi.string().required().max(25).min(2),
    lastName:Joi.string().required().max(25).min(2),
    password: Joi.string().required().custom(passwordValidation),
    birthday: Joi.string().required().custom(dateValidation)
});

export {
    signUpValidationScheme
}