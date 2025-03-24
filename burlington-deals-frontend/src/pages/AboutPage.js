// src/pages/AboutPage.js
import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Avatar,
  Divider,
  Button,
  useTheme
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PublicIcon from '@mui/icons-material/Public';
import { Link as RouterLink } from 'react-router-dom';

function AboutPage() {
  const theme = useTheme();
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom align="center">
          About Burlington Deals
        </Typography>
        
        <Typography variant="subtitle1" paragraph align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}>
          Connecting hungry diners with the best restaurant deals in Burlington since 2024.
        </Typography>
        
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <img 
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0" 
              alt="Restaurant interior" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                borderRadius: 16 
              }} 
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Our Mission
            </Typography>
            
            <Typography variant="body1" paragraph>
              Burlington Deals was born from a simple idea: to create a central platform that connects local restaurants with customers looking for great deals and specials.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Our mission is to help local restaurants thrive by increasing their visibility and filling seats during slower periods, while simultaneously helping diners discover new restaurants and enjoy great food at better prices.
            </Typography>
            
            <Typography variant="body1" paragraph>
              We're passionate about promoting local businesses and building a stronger food community in Burlington. By connecting restaurants directly with food enthusiasts, we create a win-win situation for everyone involved.
            </Typography>
            
            <Button
              component={RouterLink}
              to="/contact-us"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Get in Touch
            </Button>
          </Grid>
        </Grid>
        
        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold" align="center" sx={{ mb: 4 }}>
            Why Choose Burlington Deals?
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={2}
                sx={{ 
                  p: 4, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 60,
                    height: 60,
                    mb: 2,
                  }}
                >
                  <LocalOfferIcon fontSize="large" />
                </Avatar>
                
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Exclusive Deals
                </Typography>
                
                <Typography variant="body1">
                  We partner with restaurants to bring you exclusive deals and promotions you won't find anywhere else. Save money while discovering new favorite spots.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={2}
                sx={{ 
                  p: 4, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 60,
                    height: 60,
                    mb: 2,
                  }}
                >
                  <RestaurantIcon fontSize="large" />
                </Avatar>
                
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Support Local
                </Typography>
                
                <Typography variant="body1">
                  Every purchase through our platform helps support local businesses and keeps the Burlington dining scene vibrant and diverse. Eat well while doing good.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={2}
                sx={{ 
                  p: 4, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 60,
                    height: 60,
                    mb: 2,
                  }}
                >
                  <PublicIcon fontSize="large" />
                </Avatar>
                
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Community Focus
                </Typography>
                
                <Typography variant="body1">
                  We're committed to building a stronger food community in Burlington by connecting diners with restaurants and promoting local culinary experiences.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        
        {/* Our Story Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold" align="center" sx={{ mb: 4 }}>
            Our Story
          </Typography>
          
          <Paper elevation={1} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="body1" paragraph>
              Burlington Deals was founded in 2024 by a group of food enthusiasts and tech professionals who saw a gap in the local dining scene. We noticed that while Burlington has an amazing variety of restaurants, there wasn't a centralized platform for diners to discover special offers and promotions.
            </Typography>
            
            <Typography variant="body1" paragraph>
              At the same time, we heard from restaurant owners that they struggled to promote their specials effectively and fill seats during slower periods. We realized we could create a solution that would benefit both sides of the equation.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Starting with just a handful of restaurant partnerships, we've grown to feature dozens of local establishments across Burlington. Our platform has helped thousands of diners discover new favorite spots while saving money, and our restaurant partners have seen increased traffic and revenue during traditionally slower days and times.
            </Typography>
            
            <Typography variant="body1">
              As we continue to grow, our commitment to supporting local businesses and enhancing the Burlington dining experience remains unchanged. We're excited about the future and the opportunity to connect even more restaurants and diners through great deals.
            </Typography>
          </Paper>
        </Box>
        
        {/* CTA Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Ready to Discover Great Deals?
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ maxWidth: 700, mx: 'auto' }}>
            Start exploring the best restaurant deals in Burlington today, or list your restaurant to reach more customers.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
            <Button
              component={RouterLink}
              to="/all-deals"
              variant="contained"
              color="primary"
              size="large"
              sx={{ borderRadius: 2, px: 4 }}
            >
              Browse Deals
            </Button>
            
            <Button
              component={RouterLink}
              to="/submit-deal"
              variant="outlined"
              size="large"
              sx={{ borderRadius: 2, px: 4 }}
            >
              Submit a Deal
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default AboutPage;