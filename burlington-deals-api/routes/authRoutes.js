const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // Moved email logic directly here for simplicity
require('dotenv').config();

/**
 * Utility function to send emails
 */
const sendResetEmail = async (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click the link below to reset your password:

${resetLink}

If you did not request this, please ignore this email.`,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * POST /api/auth/register
 * Registers a new user
 */
router.post('/register', async (req, res) => {
  const { email, password, display_name } = req.body;
  if (!email || !password || !display_name) {
    return res.status(400).json({ error: 'Email, password, and display name are required.' });
  }

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO users (email, password_hash, display_name, created_at, role)
       VALUES ($1, $2, $3, NOW(), $4)
       RETURNING user_id, email, role`,
      [email, hashedPassword, display_name, 'user']
    );

    const token = jwt.sign(
      {
        user_id: newUser.rows[0].user_id,
        email: newUser.rows[0].email,
        role: newUser.rows[0].role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * POST /api/auth/login
 * Logs in a user
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * POST /api/auth/forgot
 * Sends a password reset link
 */
router.post('/forgot', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = userResult.rows[0];
    const plainToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    await pool.query(
      `INSERT INTO password_resets (user_id, token, expires_at, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [user.user_id, hashedToken, expiresAt]
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${plainToken}`;
    await sendResetEmail(user.email, resetLink);

    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * POST /api/auth/reset
 * Resets the user's password
 */
router.post('/reset', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required.' });
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const resetResult = await pool.query('SELECT * FROM password_resets WHERE token = $1', [hashedToken]);
    if (resetResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    const reset = resetResult.rows[0];
    if (new Date(reset.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Token has expired.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query('UPDATE users SET password_hash = $1 WHERE user_id = $2', [hashedPassword, reset.user_id]);
    await pool.query('DELETE FROM password_resets WHERE token = $1', [hashedToken]);

    res.status(200).json({ message: 'Password successfully updated.' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
