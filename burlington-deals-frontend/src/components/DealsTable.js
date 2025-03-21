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
  useMediaQuery
} from '@mui/material';
import { FilterAltOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
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

// =========== SingleDealCard =============
  const SingleDealCard = ({ deal, onReportClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showPerPound, setShowPerPound] = useState(false);
  const [expanded, setExpanded] = useState(false);

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

  // Address + map link
  const googleMapsUrl = deal.place_id
  ? `https://www.google.com/maps/search/?api=1&query_place_id=${deal.place_id}`
  : deal.geometry_location_lat && deal.geometry_location_lng
    ? `https://www.google.com/maps/search/?api=1&query=${deal.geometry_location_lat},${deal.geometry_location_lng}`
    : deal.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(deal.address)}`
      : null;


  // Description
  const FULL_DESC = deal.description || '';
  const SHORT_DESC = FULL_DESC.slice(0, 120);
  const isLong = FULL_DESC.length > 120;
  const displayedDesc = expanded ? FULL_DESC : SHORT_DESC;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}
    >
      {/* Restaurant + Featured */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', fontSize: isMobile ? '1rem' : '1.2rem' }}
        >
          {deal.restaurant_name}
          {deal.is_promoted && (
            <Chip
              label="Featured"
              size="small"
              sx={{
                ml: 1,
                backgroundColor: '#00c896',
                color: '#fff',
                fontWeight: 'bold'
              }}
            />
          )}
        </Typography>
      </Box>

      {/* Address row */}
      {deal.address && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography variant="body2" sx={{ color: '#666' }}>
            {deal.address}
          </Typography>
          {googleMapsUrl && (
            <Button
              variant="text"
              size="small"
              onClick={() => window.open(googleMapsUrl, '_blank')}
            >
              View on Maps
            </Button>
          )}
        </Box>
      )}

      {/* Day, Category, Times */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {deal.day_of_week && (
          <Chip
            label={deal.day_of_week}
            size="small"
            sx={{ backgroundColor: '#00c896', color: '#fff', fontWeight: 'bold' }}
          />
        )}
        {deal.category && (
          <Chip
            label={deal.category}
            size="small"
            sx={{ backgroundColor: '#333', color: '#fff', fontWeight: 'bold' }}
          />
        )}
        {timeRange && (
          <Chip
            label={timeRange}
            variant="outlined"
            size="small"
          />
        )}
      </Box>

      {/* Wing Switch */}
      {deal.category === 'Wings' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: '#777' }}>
            {showPerPound ? 'Per lb' : 'Per wing'}
          </Typography>
          <Switch
            size="small"
            checked={showPerPound}
            onChange={(e) => setShowPerPound(e.target.checked)}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#00c896'
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#00c896'
              }
            }}
          />
        </Box>
      )}

      {/* Price */}
      <Typography
        variant="body1"
        sx={{
          fontWeight: 'bold',
          color: deal.deal_type === 'event' ? '#999' : '#00c896'
        }}
      >
        {displayedPrice}
      </Typography>

      {/* Description with read-more */}
      <Typography variant="body2" sx={{ color: '#555', whiteSpace: 'pre-wrap' }}>
        {displayedDesc}
        {isLong && !expanded && '...'}
      </Typography>
      {isLong && (
        <Button
          variant="text"
          size="small"
          onClick={() => setExpanded(!expanded)}
          sx={{ p: 0, minWidth: 0 }}
        >
          {expanded ? 'Show Less' : 'Read More'}
        </Button>
      )}

      {/* "Report Deal" at the bottom, no absolute positioning */}
      <Box sx={{ mt: 1, textAlign: 'right' }}>
        <Tooltip title="Found something wrong with this deal? Click to report.">
          <Button variant="outlined" color="error" size="small" onClick={onReportClick} >
            {/* Parent will handle the onClick -> see DealsTable below */}
            Report Deal
          </Button>
        </Tooltip>
      </Box>
    </Paper>
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
      // Split deals into current day and other days
      const currentDayDeals = filtered.filter(deal => deal.day_of_week === currentDay);
      const otherDayDeals = filtered.filter(deal => deal.day_of_week !== currentDay);
      
      // Shuffle each group separately to randomize order
      const shuffledCurrentDay = shuffleArray(currentDayDeals);
      const shuffledOtherDays = shuffleArray(otherDayDeals);
      
      // Return current day deals first, then other days
      return [...shuffledCurrentDay, ...shuffledOtherDays];
    } else {
      // If a specific day is selected, just shuffle all matching deals
      return shuffleArray(filtered);
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
      <Box sx={{ mb: 4 }}>
        <Stack direction="column" spacing={2}>
          <TextField
            placeholder="Search for deals, restaurants, or categories..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
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
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="flat">Flat</MenuItem>
                <MenuItem value="percentage">Percentage</MenuItem>
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
            >
              Clear Filters
            </Button>
          </Box>
        </Stack>
      </Box>

      {/* Deal Cards */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      ) : paginatedDeals.length === 0 ? (
        <Typography textAlign="center">No deals found.</Typography>
      ) : (
        paginatedDeals.map((deal) => (
          <Box key={deal.deal_id}>
            <SingleDealCard 
              deal={deal} 
              onReportClick={() => handleOpenReport(deal)} 
            />
          </Box>
        ))
      )}

      {/* Pagination */}
      {paginatedDeals.length > 0 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(e, val) => setPage(val)}
            variant="outlined"
            color="primary"
            size={isMobile ? 'small' : 'medium'}
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
