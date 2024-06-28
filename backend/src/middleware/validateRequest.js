const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

const sanitizeString = (string) => sanitizeHtml(string, {
  allowedTags: [],
  allowedAttributes: {}
});

const createModuleSchema = Joi.object({
  name: Joi.string().required(),
  content: Joi.string().required(),
  description: Joi.string().allow('').optional()
});

const updateModuleSchema = Joi.object({
  name: Joi.string().required(),
  content: Joi.string().optional(),
  description: Joi.string().allow('').optional()
});

const schemas = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    role: Joi.string().valid('user', 'admin').default('user')
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
    content: Joi.string().required(),
    description: Joi.string().allow('').optional()
  }),
  updateModule: Joi.object({
    name: Joi.string().required(),
    content: Joi.string().required(),
    description: Joi.string().allow('').optional()
  })
};

function validateRequest(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: error.details.map(detail => detail.message) });
    }

    // Sanitize string inputs
    Object.keys(value).forEach(key => {
      if (typeof value[key] === 'string') {
        value[key] = sanitizeString(value[key]);
      }
    });

    req.body = value;
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
  updateModule: validateRequest(schemas.updateModule),
  createModule: validateRequest(createModuleSchema),
  updateModule: validateRequest(updateModuleSchema)
};
