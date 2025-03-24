// src/pages/RestaurantsPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Pagination,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import { getAllRestaurants } from '../services/restaurantService';

function RestaurantsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  
  // Fetch all restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants();
        setRestaurants(data);
        setFilteredRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurants();
  }, []);
  
  // Filter restaurants based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRestaurants(restaurants);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = restaurants.filter(
        restaurant => restaurant.name.toLowerCase().includes(term) ||
                     (restaurant.address && restaurant.address.toLowerCase().includes(term))
      );
      setFilteredRestaurants(filtered);
    }
    setPage(1);
  }, [searchTerm, restaurants]);
  
  // Get random background image for restaurant cards
  const getRandomImage = (name) => {
    const images = [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
      'https://images.unsplash.com/photo-1544148103-0773bf10d330',
      'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
    ];
    
    // Use restaurant name as seed for consistent image
    const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return images[seed % images.length];
  };
  
  // Get current page of restaurants
  const getCurrentItems = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRestaurants.slice(startIndex, endIndex);
  };
  
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Burlington Restaurants
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Discover restaurants in Burlington offering special deals and promotions.
        </Typography>
        
        {/* Search Box */}
        <Box sx={{ mb: 4, maxWidth: 500 }}>
          <TextField
            fullWidth
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 8,
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(0, 0, 0, 0.03)',
              }
            }}
          />
        </Box>
        
        {/* Restaurant Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredRestaurants.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No restaurants found matching your search.
            </Typography>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={() => setSearchTerm('')}
              sx={{ mt: 2 }}
            >
              Clear Search
            </Button>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {getCurrentItems().map((restaurant) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={restaurant.restaurant_id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={getRandomImage(restaurant.name)}
                      alt={restaurant.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {restaurant.name}
                      </Typography>
                      
                      {restaurant.address && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                          <LocationOnIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {restaurant.address}
                          </Typography>
                        </Box>
                      )}
                      
                      {restaurant.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {restaurant.phone}
                          </Typography>
                        </Box>
                      )}
                      
                      {restaurant.website && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LanguageIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            <a 
                              href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
                            >
                              Website
                            </a>
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Tags/Categories */}
                      {restaurant.types && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                          {restaurant.types.split(',').slice(0, 3).map((type, index) => (
                            <Chip 
                              key={index} 
                              label={type.trim()} 
                              size="small" 
                              sx={{ 
                                bgcolor: theme.palette.mode === 'dark' 
                                  ? 'rgba(255, 255, 255, 0.08)' 
                                  : 'rgba(0, 0, 0, 0.05)',
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </CardContent>
                    
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        fullWidth
                        href={`/all-deals?restaurant=${encodeURIComponent(restaurant.name)}`}
                      >
                        View Deals
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  size={isMobile ? 'small' : 'medium'}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}

export default RestaurantsPage;