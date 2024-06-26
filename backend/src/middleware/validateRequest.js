const Joi = require('joi');

const schemas = {
  getModule: Joi.object({
    name: Joi.string().required(),
  }),
  updateModule: Joi.object({
    name: Joi.string().required(),
    // Add validation for the module buffer
  }),
};

function validateRequest(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
}

module.exports = {
  getModule: validateRequest(schemas.getModule),
  updateModule: validateRequest(schemas.updateModule),
};
