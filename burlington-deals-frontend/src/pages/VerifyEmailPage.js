// src/pages/VerifyEmailPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing verification token.');
        return;
      }

      try {
        const response = await API.get(`/auth/verify?token=${token}`);
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Failed to verify email. The link may be expired or invalid.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%', textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Verifying your email...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please wait while we verify your email address.
            </Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Email Verified!
            </Typography>
            <Alert severity="success" sx={{ mb: 3 }}>
              {message}
            </Alert>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Login to Your Account
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <ErrorIcon color="error" sx={{ fontSize: 80, mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Verification Failed
            </Typography>
            <Alert severity="error" sx={{ mb: 3 }}>
              {message}
            </Alert>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/register')}
              sx={{ mt: 2 }}
            >
              Back to Registration
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default VerifyEmailPage;