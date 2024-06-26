const Joi = require('joi');

const schemas = {
  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
  refreshToken: Joi.object({
    token: Joi.string().required(),
  }),
  logout: Joi.object({
    token: Joi.string().required(),
  }),
  getModule: Joi.object({
    name: Joi.string().required(),
  }),
  updateModule: Joi.object({
    name: Joi.string().required(),
    // Add validation for the module buffer
    moduleBuffer: Joi.binary().required(),
  }),
};

function validateRequest(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
}

module.exports = {
  login: validateRequest(schemas.login),
  refreshToken: validateRequest(schemas.refreshToken),
  logout: validateRequest(schemas.logout),
  getModule: validateRequest(schemas.getModule),
  updateModule: validateRequest(schemas.updateModule),
};
