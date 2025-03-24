// src/components/NewsletterSignup.js
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Alert, Snackbar, useTheme } from '@mui/material';
import API from '../services/api';

const NewsletterSignup = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid email address',
        severity: 'error'
      });
      return;
    }
    
    try {
      // Call the API to subscribe
      const response = await API.post('/newsletter/subscribe', { email });
      setSnackbar({
        open: true,
        message: response.data.message || 'You\'ve been subscribed to our newsletter!',
        severity: 'success'
      });
      setEmail('');
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Failed to subscribe. Please try again.',
        severity: 'error'
      });
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  return (
    <Box sx={{ py: 8, textAlign: 'center' }}>
      <Container maxWidth="md">
        <Typography 
          variant="h3" 
          component="h2" 
          fontWeight="bold" 
          sx={{ mb: 2 }}
        >
          Never Miss a Deal
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: 4, mx: 'auto', maxWidth: '700px' }}
        >
          Subscribe to our newsletter and get the latest deals delivered straight to your inbox.
        </Typography>
        
        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            maxWidth: '500px',
            mx: 'auto',
          }}
        >
          <TextField
            fullWidth
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 30,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              }
            }}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 30,
              px: 3,
              py: { xs: 1.5, sm: 'auto' },
              whiteSpace: 'nowrap',
            }}
          >
            Subscribe
          </Button>
        </Box>
      </Container>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NewsletterSignup;