// src/pages/ResetPasswordPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  LinearProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import API from '../services/api';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Hide the token from the user but keep it for submission
  const [token] = useState(tokenFromUrl);

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

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    
    // Validate passwords
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (passwordStrength < 60) {
      setError("Please choose a stronger password");
      return;
    }
    
    setLoading(true);

    try {
      const response = await API.post('/auth/reset', { 
        token, 
        newPassword: password 
      });
      setMsg(response.data.message || 'Password reset successfully.');
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed. Token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate the color for the strength bar
  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'error';
    if (passwordStrength < 80) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Reset Your Password
        </Typography>
        
        {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please enter a new password for your account. For your security,
          choose a strong password that you don't use elsewhere.
        </Typography>

        <form onSubmit={handleReset}>
          {/* The token is hidden and auto-filled from the URL */}
          <input type="hidden" value={token} />
          
          {/* New Password field with visibility toggle */}
          <TextField
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 1 }}
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
          <Box sx={{ mb: 2 }}>
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
              <Typography variant="caption" color={hasLowerCase ? 'success.main' : 'text.secondary'}>
                ✓ Lowercase letter
              </Typography>
              <br />
              <Typography variant="caption" color={hasUpperCase ? 'success.main' : 'text.secondary'}>
                ✓ Uppercase letter
              </Typography>
              <br />
              <Typography variant="caption" color={hasNumber ? 'success.main' : 'text.secondary'}>
                ✓ Number
              </Typography>
              <br />
              <Typography variant="caption" color={hasSpecialChar ? 'success.main' : 'text.secondary'}>
                ✓ Special character
              </Typography>
              <br />
              <Typography variant="caption" color={isLongEnough ? 'success.main' : 'text.secondary'}>
                ✓ At least 8 characters
              </Typography>
            </Box>
          </Box>
          
          {/* Confirm Password field */}
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={password !== confirmPassword && confirmPassword.length > 0}
            helperText={password !== confirmPassword && confirmPassword.length > 0 ? "Passwords don't match" : ""}
            sx={{ mb: 3 }}
          />
          
          <Button 
            variant="contained" 
            type="submit" 
            fullWidth 
            disabled={loading || password !== confirmPassword || passwordStrength < 60}
            sx={{ py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ResetPasswordPage;