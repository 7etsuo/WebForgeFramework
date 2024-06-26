const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const logger = require('../utils/logger');

// This should be replaced with a database in a real application
let refreshTokens = [];

exports.login = async (req, res) => {
  // Here you would typically validate the user's credentials against a database
  const { username, password } = req.body;

  // This is a placeholder. In a real app, you'd fetch the user from a database
  const user = { id: 1, username: 'testuser', passwordHash: await bcrypt.hash('password', 10) };

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, config.jwtRefreshSecret);

  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, config.jwtRefreshSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ id: user.id, username: user.username });
    res.json({ accessToken });
  });
};

exports.logout = (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.sendStatus(204);
};

function generateAccessToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, config.jwtAccessSecret, { expiresIn: '15m' });
}
