const Joi = require("joi")

const userValidators = {}


userValidators.addUserSchema = Joi.object({
    user_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

userValidators.loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

module.exports = userValidators