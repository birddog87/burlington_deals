// authRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
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
    from: {
      name: "Burlington Deals",
      address: process.env.EMAIL_USER
    },
    to: email,
    subject: 'Reset Your Burlington Deals Password',
    text: `Hello,

You recently requested to reset your password for your Burlington Deals account. Click the link below to reset your password:

${resetLink}

This password reset link will expire in 1 hour.

If you did not request a password reset, please ignore this email and your password will remain unchanged.

Best regards,
The Burlington Deals Team
https://burlingtondeals.ca

This is an automated message. Please do not reply directly to this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="padding: 20px; background-color: #6B46C1; text-align: center;">
          <h1 style="color: white; margin: 0;">Burlington Deals</h1>
        </div>
        <div style="padding: 30px; border: 1px solid #e0e0e0; border-top: none; background-color: #ffffff;">
          <h2 style="color: #333333; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #555555; line-height: 1.5;">Hello,</p>
          <p style="color: #555555; line-height: 1.5;">You recently requested to reset your password for your Burlington Deals account. Please click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #6B46C1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset My Password</a>
          </div>
          <p style="color: #555555; line-height: 1.5;">Or copy and paste this link in your browser:</p>
          <div style="background-color: #f5f5f5; padding: 12px; border-radius: 4px;">
            <a href="${resetLink}" style="color: #6B46C1; word-break: break-all; font-size: 14px; text-decoration: none;">${resetLink}</a>
          </div>
          <p style="color: #555555; line-height: 1.5; margin-top: 25px;">This password reset link will expire in 1 hour.</p>
          <p style="color: #555555; line-height: 1.5;">If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          <p style="font-size: 14px; color: #888888; text-align: center;">Burlington Deals | <a href="https://burlingtondeals.ca" style="color: #6B46C1; text-decoration: none;">burlingtondeals.ca</a></p>
          <p style="font-size: 12px; color: #888888; text-align: center;">This is an automated message. Please do not reply directly to this email.</p>
        </div>
      </div>
    `
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
    
    // Send verification email using SendGrid
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: "Burlington Deals" // Adding sender name helps with deliverability
      },
      subject: 'Verify Your Burlington Deals Account',
      text: `Hello ${display_name},

Thank you for creating an account with Burlington Deals! To complete your registration and access all features, please verify your email address by clicking this link:

${verificationLink}

This verification link will expire in 24 hours.

If you did not create an account with us, you can safely ignore this email.

Best regards,
The Burlington Deals Team
https://burlingtondeals.ca`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="padding: 20px; background-color: #6B46C1; text-align: center;">
            <h1 style="color: white; margin: 0;">Burlington Deals</h1>
          </div>
          <div style="padding: 30px; border: 1px solid #e0e0e0; border-top: none; background-color: #ffffff;">
            <h2 style="color: #333333; margin-top: 0;">Welcome to Burlington Deals!</h2>
            <p style="color: #555555; line-height: 1.5;">Hello ${display_name},</p>
            <p style="color: #555555; line-height: 1.5;">Thank you for creating an account with us. To complete your registration and start discovering great local deals, please verify your email address:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="background-color: #6B46C1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Verify My Email</a>
            </div>
            <p style="color: #555555; line-height: 1.5;">Or copy and paste this link in your browser:</p>
            <div style="background-color: #f5f5f5; padding: 12px; border-radius: 4px;">
              <a href="${verificationLink}" style="color: #6B46C1; word-break: break-all; font-size: 14px; text-decoration: none;">${verificationLink}</a>
            </div>
            <p style="color: #555555; line-height: 1.5; margin-top: 25px;">This verification link will expire in 24 hours.</p>
            <p style="color: #555555; line-height: 1.5;">If you did not create this account, you can safely ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="font-size: 14px; color: #888888; text-align: center;">Burlington Deals | <a href="https://burlingtondeals.ca" style="color: #6B46C1; text-decoration: none;">burlingtondeals.ca</a></p>
          </div>
        </div>
      `,
      // These settings help avoid spam filters
      mail_settings: {
        bypass_list_management: {
          enable: true
        }
      },
      tracking_settings: {
        click_tracking: {
          enable: true
        },
        open_tracking: {
          enable: true
        }
      }
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
    
    // Use SendGrid with improved email template
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: user.email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: "Burlington Deals"
      },
      subject: 'Reset Your Burlington Deals Password',
      text: `Hello,

You recently requested to reset your password for your Burlington Deals account. Click the link below to reset your password:

${resetLink}

This password reset link will expire in 1 hour.

If you did not request a password reset, please ignore this email and your password will remain unchanged.

Best regards,
The Burlington Deals Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="padding: 20px; background-color: #6B46C1; text-align: center;">
            <h1 style="color: white; margin: 0;">Burlington Deals</h1>
          </div>
          <div style="padding: 30px; border: 1px solid #e0e0e0; border-top: none; background-color: #ffffff;">
            <h2 style="color: #333333; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #555555; line-height: 1.5;">Hello,</p>
            <p style="color: #555555; line-height: 1.5;">You recently requested to reset your password for your Burlington Deals account. Please click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #6B46C1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset My Password</a>
            </div>
            <p style="color: #555555; line-height: 1.5;">Or copy and paste this link in your browser:</p>
            <div style="background-color: #f5f5f5; padding: 12px; border-radius: 4px;">
              <a href="${resetLink}" style="color: #6B46C1; word-break: break-all; font-size: 14px; text-decoration: none;">${resetLink}</a>
            </div>
            <p style="color: #555555; line-height: 1.5; margin-top: 25px;">This link will expire in 1 hour.</p>
            <p style="color: #555555; line-height: 1.5;">If you did not request this password reset, please ignore this email and your password will remain unchanged.</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="font-size: 14px; color: #888888; text-align: center;">Burlington Deals | <a href="https://burlingtondeals.ca" style="color: #6B46C1; text-decoration: none;">burlingtondeals.ca</a></p>
          </div>
        </div>
      `,
      mail_settings: {
        bypass_list_management: {
          enable: true
        }
      },
      tracking_settings: {
        click_tracking: {
          enable: true
        },
        open_tracking: {
          enable: true
        }
      }
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