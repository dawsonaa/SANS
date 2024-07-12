const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const { createUser, getUserByUsername } = require('../models/user');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// User registration route
router.post('/register', [
  check('username').isAlphanumeric().withMessage('Username must be alphanumeric'),
  check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const mfaSecret = speakeasy.generateSecret().base32;
  await createUser(username, hashedPassword, mfaSecret);
  res.status(201).send('User registered successfully');
});

// User login route
router.post('/login', async (req, res) => {
  const { username, password, token } = req.body;
  const user = await getUserByUsername(username);
  if (!user) return res.status(401).send('Invalid username or password');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).send('Invalid username or password');

  const isTokenValid = speakeasy.totp.verify({
    secret: user.mfa_secret,
    encoding: 'base32',
    token,
  });
  if (!isTokenValid) return res.status(401).send('Invalid MFA token');

  const accessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ accessToken });
});

module.exports = router;
