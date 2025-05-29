import Joi from "joi";

const registerAdminValidation = Joi.object({
  username: Joi.string().max(255).required(),
  password: Joi.string().max(255).required()
});

const loginAdminValidation = Joi.object({
  username: Joi.string().max(255).required(),
  password: Joi.string().max(255).required()
});

const getAdminValidation = Joi.string().max(100).required();

export {
    registerAdminValidation,
    loginAdminValidation,
    getAdminValidation
}