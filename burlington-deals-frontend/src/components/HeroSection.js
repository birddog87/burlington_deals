// src/components/HeroSection.js
import React, { useContext } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, Chip, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const HeroSection = () => {
  const theme = useTheme();
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/all-deals?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/all-deals');
    }
  };
  
  const categories = [
    "Today's Specials", 
    "Weekend Deals", 
    "Drinks", 
    "Family Meals", 
    "Wings"
  ];

  return (
    <Box 
      sx={{ 
        textAlign: 'center',
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 4 },
        // Dark color for dark mode, light background for light mode
        backgroundColor: darkMode ? '#121417' : 'transparent',
      }}
    >
      <Box
        sx={{
          display: 'inline-block',
          px: 2,
          py: 0.5,
          borderRadius: 5,
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 85, 51, 0.15)' : 'rgba(255, 85, 51, 0.1)',
          mb: 3,
          color: theme.palette.primary.main,
        }}
      >
        <Typography variant="body2" fontWeight={500}>
          Burlington's Premier Deal Discovery Platform
        </Typography>
      </Box>
      
      <Typography
        variant="h2"
        component="h1"
        sx={{
          fontWeight: 700,
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          mb: 2,
          mx: 'auto',
          maxWidth: '800px',
        }}
      >
        Discover Delicious Deals in Burlington
      </Typography>
      
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          mb: 4,
          mx: 'auto',
          maxWidth: '700px',
        }}
      >
        Find and share the best food and drink specials from local restaurants, all in one place.
      </Typography>
      
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          maxWidth: '600px',
          mx: 'auto',
          mb: 4,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search for restaurants or deals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 30,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              '& fieldset': { border: 'none' },
              px: 1,
            },
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
          Find Deals
        </Button>
      </Box>
      
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 1,
          mb: 2
        }}
      >
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            clickable
            onClick={() => navigate(`/all-deals?category=${encodeURIComponent(category)}`)}
            sx={{
              borderRadius: 30,
              px: 1,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeroSection;