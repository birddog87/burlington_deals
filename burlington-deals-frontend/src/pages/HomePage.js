// src/pages/HomePage.js
import React from 'react';
import { Box } from '@mui/material';
import HeroSection from '../components/HeroSection';
import FeaturedDeals from '../components/FeaturedDeals';
import CategoryBrowser from '../components/CategoryBrowser';
import TodaysDeals from '../components/TodaysDeals'; // Import the new component
import RestaurantCta from '../components/RestaurantCta';
import NewsletterSignup from '../components/NewsletterSignup';

function HomePage() {
  return (
    <Box component="main">
      <HeroSection />
      <FeaturedDeals />
      <CategoryBrowser />
      <TodaysDeals />
      <RestaurantCta />
      <NewsletterSignup />
    </Box>
  );
}

export default HomePage;