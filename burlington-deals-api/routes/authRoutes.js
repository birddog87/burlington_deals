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
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    
    // Set user as inactive until verified
    const newUser = await pool.query(
      `INSERT INTO users (email, password_hash, display_name, created_at, role, is_active, verification_token)
       VALUES ($1, $2, $3, NOW(), $4, $5, $6)
       RETURNING user_id, email, role`,
      [email, hashedPassword, display_name, 'user', false, hashedToken]
    );
    
    // Create verification link
    const verificationLink = `${process.env.FRONTEND_URL || 'https://burlingtondeals.ca'}/verify-email?token=${verificationToken}`;
    
    // Send verification email
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Verify Your Email - Burlington Deals',
      text: `Thank you for registering! Please verify your email by clicking this link: ${verificationLink}`,
      html: `
        <h2>Welcome to Burlington Deals!</h2>
        <p>Thank you for registering an account. To activate your account, please click the button below:</p>
        <p>
          <a href="${verificationLink}" style="background-color: #6B46C1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
        </p>
        <p>Or copy and paste this link in your browser:</p>
        <p>${verificationLink}</p>
        <p>This link will expire in 24 hours.</p>
      `,
    };
    
    await sgMail.send(msg);

    // Return success without a token - user needs to verify first
    res.status(201).json({ 
      message: 'Registration successful! Please check your email to verify your account.',
      requiresVerification: true
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * GET /api/auth/verify
 * Verifies a user's email
 */
router.get('/verify', async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: 'Verification token is required.' });
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const userResult = await pool.query(
      'SELECT * FROM users WHERE verification_token = $1',
      [hashedToken]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid verification token.' });
    }

    const user = userResult.rows[0];
    
    // Activate the user's account
    await pool.query(
      'UPDATE users SET is_active = TRUE, verification_token = NULL WHERE user_id = $1',
      [user.user_id]
    );

    // Return success message
    res.status(200).json({ 
      message: 'Email verified successfully! You can now log in to your account.' 
    });
  } catch (err) {
    console.error('Email Verification Error:', err);
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

    // Check if the user's account is verified/active
    if (!user.is_active) {
      return res.status(400).json({ 
        error: 'Your account has not been verified.',
        requiresVerification: true
      });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
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
      // For security, don't reveal if email exists
      return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const user = userResult.rows[0];
    const plainToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // Clear any existing tokens for this user
    await pool.query('DELETE FROM password_resets WHERE user_id = $1', [user.user_id]);
    
    // Add new token
    await pool.query(
      `INSERT INTO password_resets (user_id, token, expires_at, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [user.user_id, hashedToken, expiresAt]
    );

    const resetLink = `${process.env.FRONTEND_URL || 'https://burlingtondeals.ca'}/reset-password?token=${plainToken}`;
    
    // Use SendGrid instead of nodemailer
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: user.email,
      from: process.env.SENDGRID_FROM_EMAIL, // Must be verified in SendGrid
      subject: 'Password Reset Request - Burlington Deals',
      text: `You requested a password reset. Click the link below to reset your password:

${resetLink}

If you did not request this, please ignore this email.

This link will expire in 1 hour.`,
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your Burlington Deals account.</p>
        <p>Click the button below to reset your password:</p>
        <p>
          <a href="${resetLink}" style="background-color: #6B46C1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </p>
        <p>Or copy and paste this link in your browser:</p>
        <p>${resetLink}</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    await sgMail.send(msg);

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
