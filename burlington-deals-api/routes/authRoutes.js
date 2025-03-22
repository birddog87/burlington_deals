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
You're right to be concerned about the registration process. The key issue seems to be that your frontend code still tries to immediately log in the user after registration, whereas your backend is correctly set up to require email verification.
Let me provide the complete, updated code for your RegisterPage.js with all the changes needed:
javascriptCopy// src/pages/RegisterPage.js
import React, { useState, useContext, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Alert, 
  CircularProgress,
  LinearProgress,
  InputAdornment,
  IconButton,
  Divider,
  Grid
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircleOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const RegisterPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Add this state for success messages
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const navigate = useNavigate();

  // Password strength criteria
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const isLongEnough = password.length >= 8;

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (hasLowerCase) strength += 20;
    if (hasUpperCase) strength += 20;
    if (hasNumber) strength += 20;
    if (hasSpecialChar) strength += 20;
    if (isLongEnough) strength += 20;
    
    setPasswordStrength(strength);
    
    if (strength < 40) {
      setPasswordFeedback('Weak password');
    } else if (strength < 80) {
      setPasswordFeedback('Moderate password');
    } else {
      setPasswordFeedback('Strong password');
    }
  }, [password, hasLowerCase, hasUpperCase, hasNumber, hasSpecialChar, isLongEnough]);

  // Toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Calculate the color for the strength bar
  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'error';
    if (passwordStrength < 80) return 'warning';
    return 'success';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(''); // Clear any previous success messages

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }
    
    if (passwordStrength < 60) {
      setError("Please choose a stronger password");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending registration request...");
      const response = await API.post('/auth/register', {
        email,
        password,
        display_name: displayName
      });
      
      console.log("Registration response:", response.data);
      
      // Check if the response indicates email verification is required
      if (response.data.requiresVerification) {
        setSuccess(response.data.message || 'Registration successful! Please check your email to verify your account.');
        
        // Clear the form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setDisplayName('');
      } else if (response.data.token) {
        // For backward compatibility or if verification is not required
        login(response.data.token);
        navigate('/');
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        p: { xs: 2, sm: 4 }
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%' }}>
        <Typography variant="h5" gutterBottom align="center">
          Create Your Account
        </Typography>
        
        <Divider sx={{ mb: 3 }} />

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Display Name"
                variant="outlined"
                fullWidth
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              {/* Password strength indicator */}
              <Box sx={{ mb: 2, mt: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={passwordStrength} 
                  color={getStrengthColor()}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {passwordFeedback}
                </Typography>
                
                <Box sx={{ mt: 1 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color={hasLowerCase ? 'success.main' : 'text.secondary'}>
                        <CheckCircleOutline sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle', opacity: hasLowerCase ? 1 : 0.5 }} />
                        Lowercase letter
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color={hasUpperCase ? 'success.main' : 'text.secondary'}>
                        <CheckCircleOutline sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle', opacity: hasUpperCase ? 1 : 0.5 }} />
                        Uppercase letter
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color={hasNumber ? 'success.main' : 'text.secondary'}>
                        <CheckCircleOutline sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle', opacity: hasNumber ? 1 : 0.5 }} />
                        Number
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color={hasSpecialChar ? 'success.main' : 'text.secondary'}>
                        <CheckCircleOutline sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle', opacity: hasSpecialChar ? 1 : 0.5 }} />
                        Special character
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color={isLongEnough ? 'success.main' : 'text.secondary'}>
                        <CheckCircleOutline sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle', opacity: isLongEnough ? 1 : 0.5 }} />
                        At least 8 characters
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                variant="outlined"
                fullWidth
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={password !== confirmPassword && confirmPassword.length > 0}
                helperText={password !== confirmPassword && confirmPassword.length > 0 ? "Passwords don't match" : ""}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                disabled={loading || password !== confirmPassword || passwordStrength < 60}
                sx={{ py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Account'}
              </Button>
            </Grid>
            
            <Grid item xs={12} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Button 
                  variant="text" 
                  onClick={() => navigate('/login')}
                  sx={{ p: 0, minWidth: 'auto', fontWeight: 'bold', textTransform: 'none' }}
                >
                  Sign in
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
For the backend, you'll also want to make sure your database has the correct column for storing the verification token. Let me add some debug logging to see why the verification token isn't being stored. Add this to your authRoutes.js file:
javascriptCopy// In register route, add more logging:
router.post('/register', async (req, res) => {
  const { email, password, display_name } = req.body;
  console.log("Registration request received for:", email);
  
  if (!email || !password || !display_name) {
    return res.status(400).json({ error: 'Email, password, and display name are required.' });
  }

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      console.log("User already exists:", email);
      return res.status(400).json({ error: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    console.log("Generated verification token for:", email);
    
    // First check if verification_token column exists
    try {
      const columnCheck = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='users' AND column_name='verification_token'
      `);
      
      if (columnCheck.rows.length === 0) {
        console.error("verification_token column does not exist in users table!");
        // Try to add the column
        try {
          await pool.query(`ALTER TABLE users ADD COLUMN verification_token VARCHAR(255)`);
          console.log("Added verification_token column to users table");
        } catch (alterError) {
          console.error("Failed to add verification_token column:", alterError);
        }
      } else {
        console.log("verification_token column exists");
      }
    } catch (checkError) {
      console.error("Error checking for verification_token column:", checkError);
    }
    
    // Set user as inactive until verified
    console.log("Inserting new user with verification token");
    const newUser = await pool.query(
      `INSERT INTO users (email, password_hash, display_name, created_at, role, is_active, verification_token)
       VALUES ($1, $2, $3, NOW(), $4, $5, $6)
       RETURNING user_id, email, role`,
      [email, hashedPassword, display_name, 'user', false, hashedToken]
    );
    
    console.log("User created successfully. User ID:", newUser.rows[0].user_id);
    
    // Create verification link
    const verificationLink = `${process.env.FRONTEND_URL || 'https://burlingtondeals.ca'}/verify-email?token=${verificationToken}`;
    console.log("Verification link:", verificationLink);
    
    // Send verification email
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      if (!process.env.SENDGRID_API_KEY) {
        console.error("SENDGRID_API_KEY is not set!");
      }
      
      if (!process.env.SENDGRID_FROM_EMAIL) {
        console.error("SENDGRID_FROM_EMAIL is not set!");
      }
      
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
      
      console.log("Sending verification email to:", email);
      await sgMail.send(msg);
      console.log("Verification email sent successfully to:", email);
    } catch (emailErr) {
      console.error("Error sending verification email:", emailErr);
      // Still continue even if email fails
    }

    // Return success without a token - user needs to verify first
    console.log("Returning success response for registration");
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
