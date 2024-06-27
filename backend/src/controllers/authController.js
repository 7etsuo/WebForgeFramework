const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const config = require('../config/config');
const logger = require('../utils/logger');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = new User({ username, password, role: role || 'user' });
    await user.save();
    logger.info('User registered successfully', { username, requestId: req.id });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      logger.warn('Invalid login attempt', { username, requestId: req.id });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    logger.info('User logged in successfully', { username, requestId: req.id });
    res.json({ accessToken, refreshToken });
  } catch (error) {
    logger.error('Login error', { error: error.message, requestId: req.id });
    res.status(500).json({ error: 'An error occurred during login' });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      logger.warn('Refresh token missing', { requestId: req.id });
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const refreshToken = await RefreshToken.findOne({ token });
    if (!refreshToken) {
      logger.warn('Invalid refresh token', { requestId: req.id });
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    if (refreshToken.expiryDate < new Date()) {
      await RefreshToken.deleteOne({ _id: refreshToken._id });
      logger.warn('Expired refresh token', { requestId: req.id });
      return res.status(403).json({ error: 'Refresh token expired' });
    }

    const user = await User.findById(refreshToken.user);
    if (!user) {
      logger.warn('User not found for refresh token', { requestId: req.id });
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user);

    // Delete old refresh token
    await RefreshToken.deleteOne({ _id: refreshToken._id });

    logger.info('Access token refreshed', { username: user.username, requestId: req.id });
    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    logger.error('Refresh token error', { error: error.message, requestId: req.id });
    res.status(500).json({ error: 'An error occurred during token refresh' });
  }
};

exports.logout = async (req, res) => {
  try {
    const { token } = req.body;
    await RefreshToken.deleteOne({ token });
    logger.info('User logged out', { requestId: req.id });
    res.sendStatus(204);
  } catch (error) {
    logger.error('Logout error', { error: error.message, requestId: req.id });
    res.status(500).json({ error: 'An error occurred during logout' });
  }
};

function generateAccessToken(user) {
  return jwt.sign({ id: user._id, username: user.username, role: user.role }, config.jwtAccessSecret, { expiresIn: '15m' });
}

async function generateRefreshToken(user) {
  const token = crypto.randomBytes(40).toString('hex');
  const refreshToken = new RefreshToken({
    token,
    user: user._id,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });
  await refreshToken.save();
  return token;
}
