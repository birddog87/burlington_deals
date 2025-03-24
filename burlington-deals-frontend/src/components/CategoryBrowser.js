// src/components/CategoryBrowser.js
import React, { useContext } from 'react';
import { Box, Typography, Grid, Paper, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import CoffeeIcon from '@mui/icons-material/Coffee';
import BrunchDiningIcon from '@mui/icons-material/BrunchDining';
import SetMealIcon from '@mui/icons-material/SetMeal';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import IcecreamIcon from '@mui/icons-material/Icecream';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { ThemeContext } from '../context/ThemeContext';

const CategoryBrowser = () => {
  const theme = useTheme();
  const { darkMode } = useContext(ThemeContext);
  
  const categories = [
    { name: 'Italian', icon: <LocalPizzaIcon sx={{ fontSize: 40 }} /> },
    { name: 'Coffee', icon: <CoffeeIcon sx={{ fontSize: 40 }} /> },
    { name: 'Burgers', icon: <BrunchDiningIcon sx={{ fontSize: 40 }} /> },
    { name: 'Seafood', icon: <SetMealIcon sx={{ fontSize: 40 }} /> },
    { name: 'Mexican', icon: <RestaurantIcon sx={{ fontSize: 40 }} /> },
    { name: 'Desserts', icon: <IcecreamIcon sx={{ fontSize: 40 }} /> },
    { name: 'Vegetarian', icon: <RamenDiningIcon sx={{ fontSize: 40 }} /> },
    { name: 'Drinks', icon: <LocalBarIcon sx={{ fontSize: 40 }} /> },
  ];

  return (
    <Box sx={{ 
      py: 6, 
      px: { xs: 2, sm: 4 },
      backgroundColor: theme.palette.custom.categoryBrowser
    }}>
      <Typography variant="h4" component="h2" fontWeight="bold" sx={{ mb: 4 }}>
        Browse by Category
      </Typography>
      
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={6} sm={4} md={3} lg={1.5} key={category.name}>
            <Paper
              component={RouterLink}
              to={`/all-deals?category=${encodeURIComponent(category.name)}`}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 3,
                textAlign: 'center',
                textDecoration: 'none',
                color: 'text.primary',
                transition: 'transform 0.2s, box-shadow 0.2s',
                backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: darkMode 
                    ? '0 4px 20px rgba(255,255,255,0.1)' 
                    : '0 4px 20px rgba(0,0,0,0.1)',
                }
              }}
            >
              {category.icon}
              <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                {category.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography
          component={RouterLink}
          to="/all-deals"
          variant="body2"
          sx={{
            color: theme.palette.primary.main,
            textDecoration: 'none',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          View all categories
          <Box component="span" sx={{ 
            display: 'inline-block',
            ml: 0.5,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateX(2px)' },
          }}>
            ↓
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default CategoryBrowser;