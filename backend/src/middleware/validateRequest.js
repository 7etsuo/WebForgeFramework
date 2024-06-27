const Joi = require('joi');

const schemas = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
  }),
  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),
  refreshToken: Joi.object({
    token: Joi.string().required()
  }),
  logout: Joi.object({
    token: Joi.string().required()
  }),
  getModule: Joi.object({
    name: Joi.string().required()
  }),
  createModule: Joi.object({
    name: Joi.string().required(),
    content: Joi.string().required()
  }),
  updateModule: Joi.object({
    name: Joi.string().required(),
    content: Joi.string().required()
  })
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
  register: validateRequest(schemas.register),
  login: validateRequest(schemas.login),
  refreshToken: validateRequest(schemas.refreshToken),
  logout: validateRequest(schemas.logout),
  getModule: validateRequest(schemas.getModule),
  createModule: validateRequest(schemas.createModule),
  updateModule: validateRequest(schemas.updateModule)
};
