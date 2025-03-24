// src/components/DealsTable.js

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  CircularProgress,
  Pagination,
  Chip,
  Switch,
  Grid,
  Stack,
  Modal,
  Select,
  InputLabel,
  Tooltip,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Rating,
  Divider,
  Link,
  IconButton
} from '@mui/material';
import { FilterAltOff, LocationOn, Language, Star, StarBorder, AccessTime, Event } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import dayjs from 'dayjs';

import { getApprovedDeals } from '../services/dealService';
import API from '../services/api';

// =========== ReportDealModal =============
const ReportDealModal = ({ open, onClose, deal }) => {
  const [reason, setReason] = useState('Dead deal');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deal) return;

    try {
      await API.post('/contact', {
        name: 'Deal Reporter',
        email: 'guest@burlingtondeals.ca',
        message,
        reason,
        businessName: deal.restaurant_name || 'N/A',
        phone: 'N/A'
      });
      alert('Report submitted successfully.');
    } catch (err) {
      alert('Failed to submit report. Please try again later.');
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '85%', sm: 400 },
          bgcolor: 'background.paper',
          p: 3,
          borderRadius: 2
        }}
      >
        <Typography variant="h6" gutterBottom>
          Report Deal
        </Typography>
        {deal && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            Reporting <strong>{deal.restaurant_name}</strong> ({deal.day_of_week})
          </Typography>
        )}

        <InputLabel id="reason-label">Reason</InputLabel>
        <Select
          labelId="reason-label"
          fullWidth
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="Dead deal">Deal no longer valid</MenuItem>
          <MenuItem value="Misleading">Misleading or Fraudulent</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>

        <TextField
          label="Details"
          multiline
          rows={3}
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Optional details..."
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" type="submit">
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// =========== DealCard =============
const DealCard = ({ deal, onReportClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showPerPound, setShowPerPound] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Debug entire deal object
  useEffect(() => {
    console.log('Complete deal object:', JSON.stringify(deal, null, 2));
  }, [deal]);

  // Debug website info
  useEffect(() => {
    console.log('Website info:', {
      website: deal.website,
      hasWebsite: !!deal.website
    });
  }, [deal.website]);

  // Debug rating info
  useEffect(() => {
    console.log('Rating info:', {
      rating: deal.rating,
      hasRating: !!deal.rating,
      parsedRating: parseFloat(deal.rating)
    });
  }, [deal.rating]);

  // Debug address/location info
  useEffect(() => {
    console.log('Location data:', { 
      place_id: deal.place_id,
      lat: deal.geometry_location_lat,
      lng: deal.geometry_location_lng,
      address: deal.address,
      city: deal.city
    });
  }, [deal.place_id, deal.geometry_location_lat, deal.geometry_location_lng, deal.address, deal.city]);

  // Simplified Maps URL function
  const createMapsUrl = () => {
    // Simplify for reliability - just use the address
    if (deal.address) {
      const formattedAddress = `${deal.address}`;
      console.log('Using address URL:', formattedAddress);
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formattedAddress)}`;
    }
    
    if (deal.restaurant_name) {
      const searchQuery = `${deal.restaurant_name} ${deal.city || 'Burlington'} Ontario`;
      console.log('Using name URL:', searchQuery);
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
    }
    
    return null;
  };

  // Format website URL
  let websiteUrl = null;
  if (deal.website) {
    websiteUrl = deal.website.startsWith('http') ? deal.website : `https://${deal.website}`;
    console.log('Formatted website URL:', websiteUrl);
  }

  // Price
  let displayedPrice = 'N/A';
  if (deal.deal_type === 'flat' && deal.flat_price != null) {
    displayedPrice = `$${Number(deal.flat_price).toFixed(2)}`;
  } else if (deal.deal_type === 'percentage' && deal.percentage_discount != null) {
    displayedPrice = `${deal.percentage_discount}% off`;
  } else if (deal.deal_type === 'event') {
    displayedPrice = 'Event';
  }

  if (deal.category === 'Wings' && deal.price_per_wing != null) {
    const WINGS_PER_POUND = 10;
    displayedPrice = showPerPound
      ? `$${(Number(deal.price_per_wing) * WINGS_PER_POUND).toFixed(2)}/lb`
      : `$${Number(deal.price_per_wing).toFixed(2)}/wing`;
  }

  // Times
  const formatTime = (str) => {
    const parsed = dayjs(str, 'HH:mm:ss');
    return parsed.isValid() ? parsed.format('h:mm A') : null;
  };
  const startTime = deal.start_time ? formatTime(deal.start_time) : null;
  const endTime = deal.end_time ? formatTime(deal.end_time) : null;
  const timeRange = startTime && endTime ? `${startTime} - ${endTime}` : startTime || endTime || null;

  // Description
  const FULL_DESC = deal.description || '';
  const SHORT_DESC = FULL_DESC.slice(0, 120);
  const isLong = FULL_DESC.length > 120;
  const displayedDesc = expanded ? FULL_DESC : SHORT_DESC;

  // Maps URL
  const mapsUrl = createMapsUrl();

  return (
    <Card 
      elevation={2}
      sx={{
        mb: 3,
        borderRadius: 2,
        overflow: 'visible',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)'
        },
        ...(deal.is_promoted && {
          border: `1px solid ${theme.palette.primary.main}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 16,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '0 24px 24px 0',
            borderColor: `transparent ${theme.palette.primary.main} transparent transparent`,
            zIndex: 1
          }
        })
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Restaurant Name and Rating */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            {deal.restaurant_name}
            {deal.is_promoted && (
              <Chip
                size="small"
                label="Featured"
                sx={{
                  ml: 1,
                  fontWeight: 'bold',
                  bgcolor: theme.palette.primary.main,
                  color: '#fff'
                }}
              />
            )}
          </Typography>
          
          {(deal.rating !== undefined && deal.rating !== null) && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating 
                value={parseFloat(deal.rating) || 0} 
                precision={0.5} 
                readOnly 
                size="small"
                emptyIcon={<StarBorder fontSize="inherit" />}
              />
              <Typography variant="body2" sx={{ ml: 0.5, color: 'text.secondary' }}>
                ({parseFloat(deal.rating || 0).toFixed(1)})
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Address and External Links */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            {deal.address}
            {deal.city && `, ${deal.city}`}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {mapsUrl && (
              <Button 
                startIcon={<LocationOn />}
                size="small" 
                variant="outlined"
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => console.log('Maps button clicked, URL:', mapsUrl)}
                sx={{ borderRadius: '20px' }}
              >
                View on Maps
              </Button>
            )}
            
            {websiteUrl && (
              <Button
                startIcon={<Language />}
                size="small"
                variant="outlined"
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => console.log('Website button clicked, URL:', websiteUrl)}
                sx={{ borderRadius: '20px' }}
              >
                Website
              </Button>
            )}
          </Box>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        {/* Deal Information */}
        <Box sx={{ my: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip 
              icon={<Event />}
              label={deal.day_of_week} 
              color="primary" 
              size="small"
              sx={{ fontWeight: 500 }}
            />
            
            <Chip 
              label={deal.category} 
              color="secondary" 
              size="small"
              sx={{ fontWeight: 500 }}
            />
            
            {timeRange && (
              <Chip 
                icon={<AccessTime />}
                label={timeRange} 
                variant="outlined" 
                size="small"
                sx={{ fontWeight: 500 }}
              />
            )}
          </Box>
          
          {/* Wing Price Toggle */}
          {deal.category === 'Wings' && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ mr: 1 }}>Per wing</Typography>
              <Switch
                size="small"
                checked={showPerPound}
                onChange={() => setShowPerPound(!showPerPound)}
              />
              <Typography variant="caption" sx={{ ml: 1 }}>Per pound</Typography>
            </Box>
          )}
          
          {/* Price Display */}
          <Typography 
            variant="h4" 
            component="p" 
            sx={{ 
              color: theme.palette.primary.main, 
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2rem' },
              my: 1
            }}
          >
            {displayedPrice}
          </Typography>
          
          {/* Description */}
          <Typography variant="body1" sx={{ mt: 2, color: 'text.primary', whiteSpace: 'pre-wrap' }}>
            {displayedDesc}
            {isLong && !expanded && '...'}
          </Typography>
          
          {isLong && (
            <Button
              variant="text"
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{ p: 0, mt: 1, fontSize: '0.875rem' }}
            >
              {expanded ? 'Show Less' : 'Read More'}
            </Button>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ px: 3, py: 1, justifyContent: 'flex-end' }}>
        <Button 
          variant="outlined" 
          color="error" 
          size="small" 
          onClick={onReportClick}
          sx={{ borderRadius: '20px' }}
        >
          Report Deal
        </Button>
      </CardActions>
    </Card>
  );
};

// Function to get current day of week
const getCurrentDayOfWeek = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  return days[today.getDay()];
};

// Fisher-Yates shuffle algorithm for randomizing array order
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
  }
  return newArray;
};

// =========== DealsTable =============
const DealsTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentDay] = useState(getCurrentDayOfWeek());
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    restaurant: 'all',
    day: 'all',
    category: 'all',
    deal_type: 'all'
  });

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Report
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportDealObj, setReportDealObj] = useState(null);

  useEffect(() => {
    async function fetchDeals() {
      setLoading(true);
      try {
        const data = await getApprovedDeals();
        
        // Debug API response
        console.log('API Response first item:', data.length > 0 ? data[0] : 'No deals');
        
        // Store the deals without sorting them yet
        setDeals(data || []);
      } catch (err) {
        console.error('Error fetching deals:', err);
        setDeals([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDeals();
  }, []);

  // Unique helper
  const getUnique = (arr, key) => {
    return Array.from(new Set(arr.map((item) => item[key]).filter(Boolean)));
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ restaurant: 'all', day: 'all', category: 'all', deal_type: 'all' });
    setSearchTerm('');
    setPage(1);
  };

  const filteredDeals = React.useMemo(() => {
    // First apply all filters like before
    const filtered = deals.filter((deal) => {
      const lower = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        deal.restaurant_name?.toLowerCase().includes(lower) ||
        deal.title?.toLowerCase().includes(lower) ||
        deal.description?.toLowerCase().includes(lower) ||
        deal.category?.toLowerCase().includes(lower);

      const matchRest =
        filters.restaurant === 'all' ||
        (deal.restaurant_name?.toLowerCase() === filters.restaurant.toLowerCase());

      // If a specific day is selected, use that, otherwise accept all days
      const matchDay = filters.day === 'all' || deal.day_of_week === filters.day;
      const matchCat = filters.category === 'all' || deal.category === filters.category;
      const matchType = filters.deal_type === 'all' || deal.deal_type === filters.deal_type;

      return matchSearch && matchRest && matchDay && matchCat && matchType;
    });

    // Check if we're in "All Days" mode and should prioritize current day
    if (filters.day === 'all') {
      // First, sort by promotion_tier in descending order
      const sortedByTier = [...filtered].sort((a, b) => 
        (b.promotion_tier || 0) - (a.promotion_tier || 0)
      );
      
      // Then split by current day within each tier
      const result = [];
      const tiers = [...new Set(sortedByTier.map(deal => deal.promotion_tier || 0))];
      
      tiers.forEach(tier => {
        const tierDeals = sortedByTier.filter(deal => (deal.promotion_tier || 0) === tier);
        const currentDayDeals = tierDeals.filter(deal => deal.day_of_week === currentDay);
        const otherDayDeals = tierDeals.filter(deal => deal.day_of_week !== currentDay);
        
        // Add current day deals first, then other days
        result.push(...shuffleArray(currentDayDeals), ...shuffleArray(otherDayDeals));
      });
      
      return result;
    } else {
      // If a specific day is selected, just sort by promotion tier
      return [...filtered].sort((a, b) => (b.promotion_tier || 0) - (a.promotion_tier || 0));
    }
  }, [deals, filters, searchTerm, currentDay]);

  const pageCount = Math.ceil(filteredDeals.length / itemsPerPage);
  const paginatedDeals = filteredDeals.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleOpenReport = (deal) => {
    setReportDealObj(deal);
    setReportModalOpen(true);
  };
  
  const handleCloseReport = () => {
    setReportModalOpen(false);
    setReportDealObj(null);
  };

  return (
    <Box>
      {/* Filter UI */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2,
            fontWeight: 600,
            color: theme.palette.primary.main
          }}
        >
          Find Your Perfect Deal
        </Typography>
        
        <Stack direction="column" spacing={2}>
          <TextField
            placeholder="Search for deals, restaurants, or categories..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            InputProps={{
              sx: { borderRadius: '8px' }
            }}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                label="Restaurant"
                value={filters.restaurant}
                onChange={(e) => handleFilterChange('restaurant', e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  sx: { borderRadius: '8px' }
                }}
              >
                <MenuItem value="all">All Restaurants</MenuItem>
                {getUnique(deals, 'restaurant_name').map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                select
                label="Day"
                value={filters.day}
                onChange={(e) => handleFilterChange('day', e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  sx: { borderRadius: '8px' }
                }}
              >
                <MenuItem value="all">All Days</MenuItem>
                {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((d) => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                select
                label="Category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  sx: { borderRadius: '8px' }
                }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {getUnique(deals, 'category').map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                select
                label="Deal Type"
                value={filters.deal_type}
                onChange={(e) => handleFilterChange('deal_type', e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  sx: { borderRadius: '8px' }
                }}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="flat">Price</MenuItem>
                <MenuItem value="percentage">Discount</MenuItem>
                <MenuItem value="event">Event</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end' }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<FilterAltOff />}
              onClick={clearFilters}
              sx={{ 
                borderRadius: '8px',
                px: 3
              }}
            >
              Clear Filters
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* Deal Cards */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      ) : paginatedDeals.length === 0 ? (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 2
          }}
        >
          <Typography variant="h6" gutterBottom>No deals found</Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your filters or search criteria to see more results.
          </Typography>
        </Paper>
      ) : (
        paginatedDeals.map((deal) => (
          <DealCard 
            key={deal.deal_id}
            deal={deal} 
            onReportClick={() => handleOpenReport(deal)} 
          />
        ))
      )}

      {/* Pagination */}
      {paginatedDeals.length > 0 && pageCount > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(e, val) => setPage(val)}
            color="primary"
            size={isMobile ? 'small' : 'medium'}
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: '8px',
              }
            }}
          />
        </Box>
      )}

      {/* Report Modal */}
      <ReportDealModal
        open={reportModalOpen}
        onClose={handleCloseReport}
        deal={reportDealObj}
      />
    </Box>
  );
};

export default DealsTable;