// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  useTheme
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Link as RouterLink } from 'react-router-dom';

// Import services
import { getAllDeals } from '../services/dealService';
import { getAllUsers } from '../services/adminService';
import { getAllRestaurants } from '../services/restaurantService';

function AdminDashboard() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDeals: 0,
    pendingDeals: 0,
    featuredDeals: 0,
    totalRestaurants: 0,
    totalUsers: 0,
    recentDeals: []
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all required data
        const [deals, users, restaurants] = await Promise.all([
          getAllDeals(),
          getAllUsers(),
          getAllRestaurants()
        ]);
        
        // Calculate stats
        const pendingDeals = deals.filter(deal => !deal.is_approved);
        const featuredDeals = deals.filter(deal => deal.is_promoted);
        const recentDeals = [...deals]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        
        setStats({
          totalDeals: deals.length,
          pendingDeals: pendingDeals.length,
          featuredDeals: featuredDeals.length,
          totalRestaurants: restaurants.length,
          totalUsers: users.length,
          recentDeals: recentDeals
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Welcome to the Burlington Deals admin dashboard. Manage deals, users, and restaurants from here.
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                p: 1.5,
                borderRadius: '0 0 0 16px'
              }}
            >
              <LocalOfferIcon />
            </Box>
            
            <Typography variant="h5" component="div" fontWeight="bold">
              {stats.totalDeals}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Total Deals
            </Typography>
            
            <Button 
              component={RouterLink} 
              to="/admin/deals" 
              size="small" 
              sx={{ mt: 'auto', alignSelf: 'flex-start' }}
            >
              Manage Deals
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: theme.palette.warning.main,
                color: '#fff',
                p: 1.5,
                borderRadius: '0 0 0 16px'
              }}
            >
              <PendingIcon />
            </Box>
            
            <Typography variant="h5" component="div" fontWeight="bold">
              {stats.pendingDeals}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Pending Approvals
            </Typography>
            
            <Button 
              component={RouterLink} 
              to="/admin/deals" 
              size="small" 
              sx={{ mt: 'auto', alignSelf: 'flex-start' }}
            >
              Review Deals
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: theme.palette.secondary.main,
                color: '#fff',
                p: 1.5,
                borderRadius: '0 0 0 16px'
              }}
            >
              <RestaurantIcon />
            </Box>
            
            <Typography variant="h5" component="div" fontWeight="bold">
              {stats.totalRestaurants}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Restaurants
            </Typography>
            
            <Button 
              component={RouterLink} 
              to="/restaurants" 
              size="small" 
              sx={{ mt: 'auto', alignSelf: 'flex-start' }}
            >
              View Restaurants
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: theme.palette.success.main,
                color: '#fff',
                p: 1.5,
                borderRadius: '0 0 0 16px'
              }}
            >
              <PeopleIcon />
            </Box>
            
            <Typography variant="h5" component="div" fontWeight="bold">
              {stats.totalUsers}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Registered Users
            </Typography>
            
            <Button 
              component={RouterLink} 
              to="/admin/users" 
              size="small" 
              sx={{ mt: 'auto', alignSelf: 'flex-start' }}
            >
              Manage Users
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Recent Activity */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recent Deals
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <List>
              {stats.recentDeals.length > 0 ? (
                stats.recentDeals.map((deal) => (
                  <ListItem
                    key={deal.deal_id}
                    divider
                    secondaryAction={
                      <Box>
                        {deal.is_approved ? (
                          <Chip 
                            size="small" 
                            color="success" 
                            label="Approved" 
                            icon={<CheckCircleIcon />} 
                          />
                        ) : (
                          <Chip 
                            size="small" 
                            color="warning" 
                            label="Pending" 
                            icon={<PendingIcon />} 
                          />
                        )}
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      <LocalOfferIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={deal.title || `${deal.category} Deal`}
                      secondary={
                        <>
                          {deal.restaurant_name} • {deal.day_of_week} • 
                          {new Date(deal.created_at).toLocaleDateString()}
                        </>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No recent deals found." />
                </ListItem>
              )}
            </List>
            
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button
                component={RouterLink}
                to="/admin/deals"
                endIcon={<TrendingUpIcon />}
              >
                View All Deals
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Actions
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button 
                  component={RouterLink}
                  to="/admin/deals"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ mb: 2, py: 1.5 }}
                  startIcon={<LocalOfferIcon />}
                >
                  Manage Deals
                </Button>
                
                <Button 
                  component={RouterLink}
                  to="/admin/users"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ mb: 2, py: 1.5 }}
                  startIcon={<PeopleIcon />}
                >
                  Manage Users
                </Button>
                
                <Button 
                  component={RouterLink}
                  to="/submit-deal"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ py: 1.5 }}
                  startIcon={<LocalOfferIcon />}
                >
                  Add New Deal
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card sx={{ mb: 2, bgcolor: theme.palette.primary.main, color: '#fff' }}>
                  <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {stats.pendingDeals}
                    </Typography>
                    <Typography variant="body2">
                      Pending deals need your approval
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: theme.palette.warning.light }}>
                  <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {stats.featuredDeals}
                    </Typography>
                    <Typography variant="body2">
                      Featured deals currently active
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;