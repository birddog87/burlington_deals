// src/pages/RegisterPage.js
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
      const response = await API.post('/auth/register', {
        email,
        password,
        display_name: displayName
      });

      const { token } = response.data;
      login(token);
      navigate('/');
    } catch (err) {
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