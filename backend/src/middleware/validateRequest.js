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
    // Add validation for the module buffer if needed
  }),
};

function validateRequest(schema) {
  return (req, res, next) => {
    let dataToValidate;
    
    // Determine which part of the request to validate
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      dataToValidate = req.body;
    } else if (req.method === 'GET') {
      dataToValidate = req.params;
    }

    const { error } = schema.validate(dataToValidate);
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
