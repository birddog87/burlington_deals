import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import { LinkedIn } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          maxWidth: '1400px',
          mx: 'auto',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Branding and Description */}
        <Box sx={{ mb: { xs: 2, md: 0 }, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="h6" gutterBottom>
            Burlington Deals
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Discover the best deals in Burlington! We bring you exclusive offers and discounts from your favorite local businesses.
          </Typography>
        </Box>

        {/* Links */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, mb: { xs: 2, md: 0 } }}>
          <Link href="/privacy-policy" variant="body2" sx={{ mb: 0.5, color: theme.palette.primary.main, textDecoration: 'none' }}>
            Privacy Policy
          </Link>
          <Link href="/terms-and-conditions" variant="body2" sx={{ mb: 0.5, color: theme.palette.primary.main, textDecoration: 'none' }}>
            Terms & Conditions
          </Link>
          <Link href="/contact-us" variant="body2" sx={{ mb: 0.5, color: theme.palette.primary.main, textDecoration: 'none' }}>
            Contact Us
          </Link>
        </Box>

        {/* LinkedIn Icon Only */}
        <Box>
          <IconButton href="https://www.linkedin.com/in/nicholashammond07/" target="_blank" rel="noopener" aria-label="LinkedIn">
            <LinkedIn />
          </IconButton>
        </Box>
      </Box>

      {/* Copyright */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Burlington Deals. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;