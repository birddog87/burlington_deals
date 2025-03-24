// src/components/FeaturedDeals.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, Skeleton, Container, useTheme } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';
import DealCard from './DealCard';
import { getApprovedDeals } from '../services/dealService';

const FeaturedDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const allDeals = await getApprovedDeals();
        // Filter to only show promoted deals in featured section
        const featuredDeals = allDeals.filter(deal => deal.is_promoted).slice(0, 4);
        setDeals(featuredDeals);
      } catch (error) {
        console.error('Error fetching featured deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  return (
    <Box sx={{ 
      py: 6, 
      px: { xs: 2, sm: 4 },
      backgroundColor: theme.palette.custom.featuredDeals
    }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2" fontWeight="bold">
            Featured Deals
          </Typography>
          <Button 
            component={RouterLink}
            to="/all-deals"
            endIcon={<ArrowForwardIcon />}
            color="primary"
            sx={{ fontWeight: 'medium' }}
          >
            View all
          </Button>
        </Box>

        <Grid container spacing={3}>
          {loading ? (
            // Show skeletons while loading
            Array.from(new Array(4)).map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 3 }} />
                <Skeleton variant="text" height={30} sx={{ mt: 1 }} />
                <Skeleton variant="text" height={20} width="60%" />
                <Skeleton variant="text" height={60} sx={{ mt: 1 }} />
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                  <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                </Box>
              </Grid>
            ))
          ) : deals.length > 0 ? (
            deals.map((deal) => (
              <Grid item xs={12} sm={6} md={3} key={deal.deal_id}>
                <DealCard deal={deal} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography align="center" color="text.secondary">
                No featured deals available at the moment.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturedDeals;