// src/components/TodaysDeals.js
import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Grid, Button, Container, useTheme } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';
import DealCard from './DealCard';
import { getApprovedDeals } from '../services/dealService';
import { ThemeContext } from '../context/ThemeContext';

const TodaysDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const { darkMode } = useContext(ThemeContext);
  
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const allDeals = await getApprovedDeals();
        
        // Get today's day of the week
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = daysOfWeek[new Date().getDay()];
        
        console.log("Today is:", today);
        console.log("Looking for deals on day:", today);
        
        // Filter deals for today and log what we find
        const todaysDeals = allDeals.filter(deal => {
          const match = deal.day_of_week === today;
          if (match) console.log("Found deal for today:", deal.title);
          return match;
        }).slice(0, 4);
        
        console.log(`Found ${todaysDeals.length} deals for today (${today})`);
        setDeals(todaysDeals);
      } catch (error) {
        console.error('Error fetching today\'s deals:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDeals();
  }, []);

  if (deals.length === 0 && !loading) {
    return null; // Don't show the section if no deals for today
  }

  return (
    <Box sx={{ 
      py: 6, 
      px: { xs: 2, sm: 4 },
      // Apply dark background only in dark mode, use light background in light mode
      backgroundColor: darkMode ? '#161A22' : '#FAFCFD'
    }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2" fontWeight="bold">
            Today's Deals
          </Typography>
          <Button 
            component={RouterLink}
            to={`/all-deals?category=Today's Specials`} // Use Today's Specials as the category
            endIcon={<ArrowForwardIcon />}
            color="primary"
            sx={{ fontWeight: 'medium' }}
            >
            View all
            </Button>
        </Box>

        <Grid container spacing={3}>
          {deals.map((deal) => (
            <Grid item xs={12} sm={6} md={3} key={deal.deal_id}>
              <DealCard deal={deal} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TodaysDeals;