// src/components/Footer.js
import React from 'react';
import { Box, Typography, Grid, Link, Container, Divider, IconButton, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Footer = () => {
  const theme = useTheme();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: theme.palette.mode === 'dark' ? '#121212' : '#F7F7F7',
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and description */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                display: 'inline-block',
                fontWeight: 700,
                fontSize: '1.25rem',
                color: 'text.primary',
                textDecoration: 'none',
                mb: 2,
              }}
            >
              Burlington<span style={{ color: theme.palette.primary.main }}>Deals</span>
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Discover the best dining deals and promotions in
              Burlington, Ontario. Save money while supporting
              local restaurants.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <IconButton 
                aria-label="Facebook" 
                component="a" 
                href="https://facebook.com"
                target="_blank"
                size="small"
                sx={{ 
                  color: theme.palette.mode === 'dark' ? '#FFF' : '#333',
                  '&:hover': { color: theme.palette.primary.main }
                }}
              >
                <FacebookIcon />
              </IconButton>
              
              <IconButton 
                aria-label="Instagram" 
                component="a" 
                href="https://www.instagram.com/fooddeals.events"
                target="_blank"
                size="small"
                sx={{ 
                  color: theme.palette.mode === 'dark' ? '#FFF' : '#333',
                  '&:hover': { color: theme.palette.primary.main }
                }}
              >
                <InstagramIcon />
              </IconButton>
              
            </Box>
          </Grid>
          
          {/* Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              QUICK LINKS
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { label: 'Home', path: '/' },
                { label: 'All Deals', path: '/all-deals' },
                { label: 'Restaurants', path: '/restaurants' },
                { label: 'Submit a Deal', path: '/submit-deal' },
              ].map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.path}
                  color="text.secondary"
                  underline="hover"
                  sx={{ display: 'inline-block' }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>
          
          {/* Information */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              INFORMATION
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { label: 'About Us', path: '/about' },
                { label: 'Contact', path: '/contact-us' },
                { label: 'Privacy Policy', path: '/privacy-policy' },
                { label: 'Terms of Service', path: '/terms-and-conditions' },
              ].map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.path}
                  color="text.secondary"
                  underline="hover"
                  sx={{ display: 'inline-block' }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>
          
          {/* Contact */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              CONTACT
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Burlington, Ontario, Canada
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" color="action" />
                <Link
                  href="mailto:contact@burlingtondeals.ca"
                  color="text.secondary"
                  underline="hover"
                >
                  contact@burlingtondeals.ca
                </Link>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  (123) 456-7890
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Burlington Deals. All rights reserved.
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Made with <FavoriteIcon sx={{ fontSize: 14, mx: 0.5, color: '#FF5533' }} /> in Burlington
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;