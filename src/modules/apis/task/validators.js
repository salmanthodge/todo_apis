const Joi = require("joi")

const taskValidators = {}


taskValidators.createTaskSchema = Joi.object({
    task_name: Joi.string().required(),
    description: Joi.string().required()
  });



module.exports = taskValidators