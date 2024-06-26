const { v4: uuidv4 } = require('uuid');

function addRequestId(req, res, next) {
  req.id = uuidv4();
  res.setHeader('X-Request-Id', req.id);
  next();
}

module.exports = addRequestId;
