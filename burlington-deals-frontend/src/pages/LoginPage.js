// src/pages/LoginPage.js

import React, { useState, useContext } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api'; // Use the configured Axios instance

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await API.post('/auth/login', { email, password });
    
    // Check if the user's account is active
    if (response.data.requiresVerification) {
      setError('Please verify your email address before logging in. Check your inbox.');
      setLoading(false);
      return;
    }
    
    const { token } = response.data;
    login(token);
    navigate('/');
  } catch (err) {
    setError(err.response?.data?.error || 'Login failed. Please try again.');
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
        height: '100vh'
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>

          {/* Forgot Password Link */}
          <Box sx={{ textAlign: 'right' }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/forgot-password')}
              sx={{ textDecoration: 'none' }}
            >
              Forgot Password?
            </Link>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
