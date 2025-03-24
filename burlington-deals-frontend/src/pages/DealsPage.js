// src/pages/DealsPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Slider,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { useLocation, useNavigate } from 'react-router-dom';
import DealCard from '../components/DealCard';
import { getApprovedDeals } from '../services/dealService';

function DealsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    days: [],
    categories: [],
    areas: [],
    dealTypes: [],
    priceRange: [0, 100],
  });
  
  // Sort state
  const [sortOption, setSortOption] = useState('relevance');
  
  // Get unique options from deals data
  const getUniqueValues = (field) => {
    return [...new Set(deals.map(deal => deal[field]).filter(Boolean))];
  };
  
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  useEffect(() => {
    // Extract search parameters from URL query
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search') || '';
    const categoryQuery = params.get('category') || '';
    
    setSearchTerm(searchQuery);
    
    const fetchDeals = async () => {
      try {
        const data = await getApprovedDeals();
        setDeals(data);
        
        // Handle special category filters
        if (categoryQuery === "Today's Specials") {
          // Get today's day of the week
          const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          const today = daysOfWeek[new Date().getDay()];
          setFilters(prev => ({
            ...prev,
            days: [today.substring(0, 3)], // Using first 3 letters (Mon, Tue, etc.)
          }));
        } else if (categoryQuery === "Weekend Deals") {
          setFilters(prev => ({
            ...prev,
            days: ['Sat', 'Sun'],
          }));
        } else if (categoryQuery) {
          setFilters(prev => ({
            ...prev,
            categories: [categoryQuery],
          }));
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDeals();
  }, [location.search]);
  
  
  // Apply filters whenever filters or deals change
  useEffect(() => {
    if (!deals.length) return;
    
    let results = [...deals];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(deal => 
        deal.title?.toLowerCase().includes(term) ||
        deal.description?.toLowerCase().includes(term) ||
        deal.restaurant_name?.toLowerCase().includes(term) ||
        deal.category?.toLowerCase().includes(term)
      );
    }
    
    // Apply day filters
    if (filters.days.length > 0) {
        results = results.filter(deal => {
          // If we're looking for weekend deals
          if (filters.days.includes('Sat') && filters.days.includes('Sun') && 
              (deal.day_of_week === 'Saturday' || deal.day_of_week === 'Sunday')) {
            return true;
          }
          
          // Normal day filtering
          const dayAbbrev = deal.day_of_week?.substring(0, 3);
          return filters.days.includes(dayAbbrev);
        });
      }
      
    
    // Apply category filters
    if (filters.categories.length > 0) {
      results = results.filter(deal => 
        filters.categories.includes(deal.category) || 
        (deal.second_category && filters.categories.includes(deal.second_category))
      );
    }
    
    // Apply area filters
    if (filters.areas.length > 0) {
      results = results.filter(deal => {
        // Extract area from address or use a default
        const area = deal.address ? deal.address.split(',')[0].trim() : 'Burlington';
        return filters.areas.includes(area);
      });
    }
    
    // Apply deal type filters
    if (filters.dealTypes.length > 0) {
      results = results.filter(deal => {
        if (filters.dealTypes.includes('Flat Price') && deal.deal_type === 'flat') return true;
        if (filters.dealTypes.includes('Percentage Discount') && deal.deal_type === 'percentage') return true;
        if (filters.dealTypes.includes('Special Event') && deal.deal_type === 'event') return true;
        return false;
      });
    }
    
    // Apply price range
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100) {
      results = results.filter(deal => {
        const price = deal.flat_price || deal.price || 0;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }
    
    // Apply sorting
    if (sortOption === 'price-low') {
      results.sort((a, b) => (a.flat_price || a.price || 0) - (b.flat_price || b.price || 0));
    } else if (sortOption === 'price-high') {
      results.sort((a, b) => (b.flat_price || b.price || 0) - (a.flat_price || a.price || 0));
    } else if (sortOption === 'newest') {
      results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    // Default is 'relevance' which keeps promoted deals at the top
    
    setFilteredDeals(results);
  }, [deals, searchTerm, filters, sortOption]);
  
  const toggleDay = (day) => {
    setFilters(prev => {
      const newDays = prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day];
      return { ...prev, days: newDays };
    });
  };
  
  const toggleFilter = (field, value) => {
    setFilters(prev => {
      const currentValues = prev[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };
  
  const handlePriceChange = (event, newValue) => {
    setFilters(prev => ({ ...prev, priceRange: newValue }));
  };
  
  const clearFilters = () => {
    setFilters({
      days: [],
      categories: [],
      areas: [],
      dealTypes: [],
      priceRange: [0, 100],
    });
    setSearchTerm('');
    navigate('/all-deals');
  };
  
  // Filter UI component (desktop and mobile share the same content)
  const filterContent = (
    <Box sx={{ p: isMobile ? 3 : 0 }}>
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={() => setMobileFiltersOpen(false)}>
            <ClearIcon />
          </IconButton>
        </Box>
      )}
      
      {/* Days filter */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Days Available
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {daysOfWeek.map(day => (
            <Chip
              key={day}
              label={day}
              clickable
              color={filters.days.includes(day) ? 'primary' : 'default'}
              onClick={() => toggleDay(day)}
              variant={filters.days.includes(day) ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>
      
      {/* Categories filter */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Cuisine Categories
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {getUniqueValues('category').map(category => (
            <Chip
              key={category}
              label={category}
              clickable
              color={filters.categories.includes(category) ? 'primary' : 'default'}
              onClick={() => toggleFilter('categories', category)}
              variant={filters.categories.includes(category) ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>
      
      {/* Areas filter */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Areas
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {['Downtown', 'North Burlington', 'South Burlington', 'East Burlington', 'Waterfront'].map(area => (
            <Chip
              key={area}
              label={area}
              clickable
              color={filters.areas.includes(area) ? 'primary' : 'default'}
              onClick={() => toggleFilter('areas', area)}
              variant={filters.areas.includes(area) ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>
      
      {/* Deal types filter */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Deal Types
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {['Flat Price', 'Percentage Discount', 'Special Event'].map(type => (
            <Chip
              key={type}
              label={type}
              clickable
              color={filters.dealTypes.includes(type) ? 'primary' : 'default'}
              onClick={() => toggleFilter('dealTypes', type)}
              variant={filters.dealTypes.includes(type) ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>
      
      {/* Price range filter */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Price Range
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={100}
            marks={[
              { value: 0, label: '$0' },
              { value: 100, label: '$100' },
            ]}
          />
        </Box>
      </Box>
      
      {isMobile && (
        <Button
          variant="contained"
          fullWidth
          onClick={() => setMobileFiltersOpen(false)}
          sx={{ mt: 2 }}
        >
          Apply Filters
        </Button>
      )}
    </Box>
  );

  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 4 } }}>
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
        Browse Deals
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
        {/* Search & Filter toolbar */}
        <Box sx={{ display: 'flex', flexGrow: 1, gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search input */}
          <TextField
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, maxWidth: { xs: '100%', sm: 300 } }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                  }
                }}
              />
              
              {/* Sort dropdown */}
              <FormControl sx={{ minWidth: 150 }}>
                <Select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  displayEmpty
                  size="small"
                >
                  <MenuItem value="relevance">Relevance</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="newest">Newest First</MenuItem>
                </Select>
              </FormControl>
              
              {/* Mobile filter button */}
              {isMobile && (
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  Filters
                </Button>
              )}
              
              {/* Clear filters button (only show if filters are applied) */}
              {(filters.days.length > 0 || filters.categories.length > 0 || 
                filters.areas.length > 0 || filters.dealTypes.length > 0 || 
                filters.priceRange[0] > 0 || filters.priceRange[1] < 100 || searchTerm) && (
                <Button
                  variant="text"
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </Box>
          </Box>
          
          {/* Main Content Area */}
          <Box sx={{ display: 'flex', gap: 4 }}>
            {/* Desktop Filters Sidebar */}
            {!isMobile && (
              <Paper
                sx={{
                  width: 280,
                  flexShrink: 0,
                  p: 3,
                  height: 'fit-content',
                  position: 'sticky',
                  top: 80,
                }}
              >
                {filterContent}
              </Paper>
            )}
            
            {/* Deals Grid */}
            <Box sx={{ flexGrow: 1 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : filteredDeals.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    No deals found matching your criteria.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={clearFilters}
                    sx={{ mt: 2 }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {filteredDeals.map(deal => (
                    <Grid item xs={12} sm={6} md={4} lg={4} key={deal.deal_id}>
                      <DealCard deal={deal} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Box>
          
          {/* Mobile Filters Drawer */}
          <Drawer
            anchor="left"
            open={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
            PaperProps={{
              sx: {
                width: '100%',
                maxWidth: 340,
                p: 2,
              }
            }}
          >
            {filterContent}
          </Drawer>
        </Box>
      );
    }
    
    export default DealsPage;