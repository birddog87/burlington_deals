// src/components/RestaurantCta.js
import React, { useContext } from 'react';
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const RestaurantCta = () => {
  const theme = useTheme();
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <Box 
      sx={{ 
        py: 8, 
        // Light pink/coral gradient for light mode, darker background for dark mode
        background: darkMode 
          ? '#1E1E1E' 
          : 'linear-gradient(to right, #FFF5F2, #FFF9F2)', 
        textAlign: 'center'
      }}
    >
      <Container maxWidth="md">
        <Typography variant="subtitle1" color="primary" fontWeight="medium" gutterBottom>
          For Restaurant Owners
        </Typography>
        
        <Typography 
          variant="h3" 
          component="h2" 
          fontWeight="bold" 
          sx={{ mb: 2 }}
        >
          Boost Your Business with Burlington Deals
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: 4, mx: 'auto', maxWidth: '700px' }}
        >
          Join hundreds of local restaurants promoting their special offers to thousands of hungry
          customers in the Burlington area.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
          <Button
            component={RouterLink}
            to="/submit-deal"
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 4, py: 1.5, borderRadius: 30 }}
          >
            Join as a Restaurant
          </Button>
          
          <Button
            component={RouterLink}
            to="/for-restaurants"
            variant="outlined"
            size="large"
            sx={{ px: 4, py: 1.5, borderRadius: 30 }}
          >
            Learn More
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default RestaurantCta;