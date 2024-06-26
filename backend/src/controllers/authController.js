const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const logger = require('../utils/logger');

// This should be replaced with a database in a real application
let refreshTokens = [];

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // This is a placeholder. In a real app, you'd fetch the user from a database
    const user = { id: 1, username: 'testuser', passwordHash: await bcrypt.hash('password', 10) };

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      logger.warn('Invalid login attempt', { username, requestId: req.id });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, config.jwtRefreshSecret, { algorithm: 'HS256' });

    refreshTokens.push(refreshToken);

    logger.info('User logged in successfully', { username, requestId: req.id });
    res.json({ accessToken, refreshToken });
  } catch (error) {
    logger.error('Login error', { error: error.message, requestId: req.id });
    res.status(500).json({ error: 'An error occurred during login' });
  }
};

exports.refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) {
    logger.warn('Refresh token missing', { requestId: req.id });
    return res.status(400).json({ error: 'Refresh token is required' });
  }
  if (!refreshTokens.includes(token)) {
    logger.warn('Invalid refresh token', { requestId: req.id });
    return res.status(403).json({ error: 'Invalid refresh token' });
  }

  jwt.verify(token, config.jwtRefreshSecret, { algorithms: ['HS256'] }, (err, user) => {
    if (err) {
      logger.warn('Failed to verify refresh token', { error: err.message, requestId: req.id });
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    const accessToken = generateAccessToken({ id: user.id, username: user.username });
    logger.info('Access token refreshed', { username: user.username, requestId: req.id });
    res.json({ accessToken });
  });
};

exports.logout = (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(t => t !== token);
  logger.info('User logged out', { requestId: req.id });
  res.sendStatus(204);
};

function generateAccessToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, config.jwtAccessSecret, { expiresIn: '15m', algorithm: 'HS256' });
}
