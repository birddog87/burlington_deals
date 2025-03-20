// src/pages/HomePage.js
import React from 'react';
import { Typography, Box } from '@mui/material';
import DealsTable from '../components/DealsTable';

function HomePage() {
  return (
    <Box className="py-4" component="main">
      {/* Simple heading without Helmet */}
      <Typography
        variant="h3"
        component="h1"
        sx={{ fontSize: { xs: '1.875rem', sm: '2.25rem' }, fontWeight: 'bold', mb: 4 }}
      >
        Welcome to Burlington Deals
      </Typography>

      <DealsTable />
    </Box>
  );
}

export default HomePage;
