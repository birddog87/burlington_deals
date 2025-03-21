// src/pages/AddDealPage.js
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Radio,
  RadioGroup,
  FormControlLabel,
  Switch,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  ListItemText,
  Snackbar,
  Alert,
  Slide,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { createDeal } from '../services/dealService';
import { searchRestaurants, createRestaurant } from '../services/restaurantService';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EventIcon from '@mui/icons-material/Event';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RepeatIcon from '@mui/icons-material/Repeat';

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const CATEGORIES = [
  'Wings', 'Beer', 'Wine', 'Cocktails', 'Appetizers', 'Entrees', 
  'Desserts', 'Happy Hour', 'Tacos', 'Fish & Chips', 'Burgers', 'Pizza', 'Other'
];

const WINGS_PER_POUND = 10;

function AddDealPage() {
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    restaurant_id: '',
    restaurant_name: '',
    title: '',
    description: '',
    price: '',
    day_of_week: [],
    category: '',
    second_category: '',
    customCategory: '',
    start_time: null,
    end_time: null,
    is_recurring: true,
    wing_price_unit: 'per_wing'
  });

  const [restaurantOptions, setRestaurantOptions] = useState([]);
  const [restaurantLoading, setRestaurantLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [showAddRestaurantDialog, setShowAddRestaurantDialog] = useState(false);
  const [newRestName, setNewRestName] = useState('');
  const [newRestCity, setNewRestCity] = useState('');
  const [newRestProvince, setNewRestProvince] = useState('');
  const [newRestAddress, setNewRestAddress] = useState('');

  // Custom menu props for better dropdown styling
  const customMenuProps = {
    PaperProps: {
      style: {
        maxHeight: 300,
        width: 'auto',
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0px 5px 15px rgba(0,0,0,0.2)',
        borderRadius: '8px',
      },
    },
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
  };

  const handleSearchRestaurants = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (!query || query.length < 2) {
      setRestaurantOptions([]);
      return;
    }
    setRestaurantLoading(true);
    try {
      const results = await searchRestaurants(query);
      setRestaurantOptions(results);
    } catch (err) {
      showSnackbar('Failed to search restaurants. Please try again.', 'error');
    } finally {
      setRestaurantLoading(false);
    }
  };

  const handleSelectRestaurant = (rest) => {
    setFormData((prev) => ({
      ...prev,
      restaurant_id: rest.restaurant_id,
      restaurant_name: rest.name
    }));
    setSearchTerm(rest.name);
    setRestaurantOptions([]);
  };

  const handleCreateNewRestaurant = async () => {
    if (!newRestName || !newRestAddress || !newRestCity || !newRestProvince) {
      showSnackbar('Please fill in all required fields.', 'error');
      return;
    }
    try {
      await createRestaurant({
        name: newRestName,
        address: newRestAddress,
        city: newRestCity,
        province: newRestProvince,
      });

      setNewRestName('');
      setNewRestAddress('');
      setNewRestCity('');
      setNewRestProvince('');
      setShowAddRestaurantDialog(false);
      showSnackbar('🎉 Thank you for submitting your restaurant! It will be reviewed and should be up in 24-48 hours.', 'success');
    } catch (err) {
      showSnackbar('Failed to create new restaurant. Please try again.', 'error');
    }
  };

  const handleDayChange = (event) => {
    const { value } = event.target;
    if (value.includes('Every Day')) {
      setFormData((prev) => ({
        ...prev,
        day_of_week: DAYS_OF_WEEK
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      day_of_week: value
    }));
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTimeChange = (field) => (newValue) => {
    setFormData((prev) => ({
      ...prev,
      [field]: newValue ? dayjs(newValue).format('HH:mm:ss') : null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let finalCategory = formData.category;
    if (finalCategory === 'Other') {
      finalCategory = formData.customCategory.trim() || 'Other';
    }

    let price_per_wing = null;
    if (formData.category === 'Wings') {
      if (formData.wing_price_unit === 'per_wing') {
        price_per_wing = parseFloat(formData.price);
      } else {
        price_per_wing = parseFloat(formData.price) / WINGS_PER_POUND;
      }
    }

    if (!formData.day_of_week || formData.day_of_week.length === 0) {
      showSnackbar('Please select at least one day of the week.', 'error');
      setLoading(false);
      return;
    }

    try {
      const dayArray = formData.day_of_week;
      const promises = dayArray.map((day) => {
        const dataToSubmit = {
          ...formData,
          category: finalCategory,
          day_of_week: day,
          price_per_wing
        };
        return createDeal(dataToSubmit);
      });

      await Promise.all(promises);
      showSnackbar('Deal(s) submitted successfully! You can add more deals if you\'d like.', 'success');

      setFormData((prev) => ({
        ...prev,
        title: '',
        description: '',
        price: '',
        day_of_week: [],
        category: '',
        second_category: '',
        customCategory: '',
        start_time: null,
        end_time: null,
        is_recurring: true,
        wing_price_unit: 'per_wing'
      }));
    } catch (err) {
      showSnackbar('Failed to submit deal. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 800, mx: 'auto', my: 5, px: 2 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            Add a New Deal
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Fill out the details below. If your restaurant isn't in our database, click "Add New Restaurant."
            For deals running on multiple days, select them all or choose "Every Day".
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 3 }}>
            {/* Restaurant Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <RestaurantIcon color="primary" />
              <Typography variant="h6">Restaurant</Typography>
            </Box>
            
            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                label="Search for a restaurant"
                placeholder="Type restaurant name..."
                value={searchTerm}
                onChange={handleSearchRestaurants}
                variant="outlined"
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                  sx: { borderRadius: 1 }
                }}
              />
              {restaurantLoading && (
                <CircularProgress 
                  size={24} 
                  sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }} 
                />
              )}
            </Box>

            {restaurantOptions.length > 0 && (
              <Paper
                sx={{
                  maxHeight: 200,
                  overflow: 'auto',
                  mt: 0,
                  borderRadius: 1,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                {restaurantOptions.map((r) => (
                  <Box
                    key={r.restaurant_id}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.light, 0.1),
                      },
                      '&:last-child': {
                        borderBottom: 'none'
                      }
                    }}
                    onClick={() => handleSelectRestaurant(r)}
                  >
                    {r.name}
                  </Box>
                ))}
              </Paper>
            )}

            <Button
              variant="outlined"
              size="medium"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setShowAddRestaurantDialog(true)}
              sx={{ 
                alignSelf: 'flex-start',
                mb: 2,
                borderRadius: 1.5,
                px: 2
              }}
            >
              Add New Restaurant
            </Button>

            <Divider sx={{ my: 2 }} />

            {/* Deal Details Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <DescriptionIcon color="primary" />
              <Typography variant="h6">Deal Details</Typography>
            </Box>

            <TextField
              label="Deal Title"
              name="title"
              fullWidth
              required
              value={formData.title}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ borderRadius: 1 }}
            />

            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              variant="outlined"
              placeholder="Describe the deal in detail..."
              sx={{ borderRadius: 1 }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AttachMoneyIcon color="primary" />
              <Typography variant="h6">Pricing</Typography>
            </Box>

            <TextField
              label="Price"
              name="price"
              fullWidth
              value={formData.price}
              onChange={handleInputChange}
              variant="outlined"
              placeholder="Enter the deal price..."
              sx={{ borderRadius: 1 }}
            />

            {formData.category === 'Wings' && (
              <FormControl component="fieldset" sx={{ ml: 1 }}>
                <RadioGroup
                  row
                  name="wing_price_unit"
                  value={formData.wing_price_unit}
                  onChange={handleInputChange}
                >
                  <FormControlLabel 
                    value="per_wing" 
                    control={<Radio color="primary" />} 
                    label="Price per Wing" 
                    sx={{ mr: 4 }}
                  />
                  <FormControlLabel 
                    value="per_pound" 
                    control={<Radio color="primary" />} 
                    label="Price per Pound" 
                  />
                </RadioGroup>
              </FormControl>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, mt: 2 }}>
              <EventIcon color="primary" />
              <Typography variant="h6">Schedule</Typography>
            </Box>

            <FormControl fullWidth variant="outlined">
              <InputLabel id="day-of-week-label">Day(s) of Week</InputLabel>
              <Select
                labelId="day-of-week-label"
                multiple
                value={formData.day_of_week}
                onChange={handleDayChange}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={customMenuProps}
                label="Day(s) of Week"
              >
                <MenuItem 
                  value="Every Day"
                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    py: 1.5
                  }}
                >
                  <Checkbox 
                    checked={formData.day_of_week.length === DAYS_OF_WEEK.length} 
                    sx={{ 
                      color: theme.palette.primary.main,
                      '&.Mui-checked': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                  <ListItemText primary={<Typography fontWeight="medium">Every Day</Typography>} />
                </MenuItem>
                
                {DAYS_OF_WEEK.map((day) => (
                  <MenuItem key={day} value={day} sx={{ py: 1.2 }}>
                    <Checkbox 
                      checked={formData.day_of_week.indexOf(day) > -1} 
                      sx={{ 
                        color: theme.palette.primary.main,
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                    <ListItemText primary={day} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TimePicker
                label="Start Time"
                value={formData.start_time ? dayjs(formData.start_time, 'HH:mm:ss') : null}
                onChange={handleTimeChange('start_time')}
                slotProps={{
                  textField: {
                    variant: 'outlined',
                    fullWidth: true,
                    sx: { borderRadius: 1 }
                  },
                }}
              />
              <TimePicker
                label="End Time"
                value={formData.end_time ? dayjs(formData.end_time, 'HH:mm:ss') : null}
                onChange={handleTimeChange('end_time')}
                slotProps={{
                  textField: {
                    variant: 'outlined',
                    fullWidth: true,
                    sx: { borderRadius: 1 }
                  },
                }}
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_recurring}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_recurring: e.target.checked }))}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RepeatIcon fontSize="small" color="action" />
                  <Typography>This is a recurring deal</Typography>
                </Box>
              }
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, mt: 2 }}>
              <CategoryIcon color="primary" />
              <Typography variant="h6">Categorization</Typography>
            </Box>

            <FormControl fullWidth variant="outlined">
              <InputLabel id="category-label">Primary Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                MenuProps={customMenuProps}
                label="Primary Category"
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat} sx={{ py: 1.2 }}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {formData.category === 'Other' && (
              <TextField
                label="Custom Category"
                name="customCategory"
                fullWidth
                value={formData.customCategory}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="Enter your custom category..."
                sx={{ borderRadius: 1 }}
              />
            )}

            <TextField
              label="Secondary Category (Optional)"
              name="second_category"
              fullWidth
              value={formData.second_category}
              onChange={handleInputChange}
              variant="outlined"
              placeholder="Optional additional category..."
              sx={{ borderRadius: 1 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading && <CircularProgress size="1rem" color="inherit" />}
                sx={{ 
                  py: 1.5, 
                  px: 5, 
                  borderRadius: 1.5,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  fontSize: '1rem',
                  fontWeight: 'medium'
                }}
              >
                {loading ? 'Submitting...' : 'Submit Deal'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Dialog to add a new restaurant */}
      <Dialog 
        open={showAddRestaurantDialog} 
        onClose={() => setShowAddRestaurantDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: '1.5rem', 
          fontWeight: 600, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2
        }}>
          Add a New Restaurant
        </DialogTitle>
        <DialogContent sx={{ pt: 3, px: 3, pb: 1 }}>
          <TextField
            label="Restaurant Name"
            fullWidth
            margin="normal"
            variant="outlined"
            value={newRestName}
            onChange={(e) => setNewRestName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            variant="outlined"
            value={newRestAddress}
            onChange={(e) => setNewRestAddress(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="City"
            fullWidth
            margin="normal"
            variant="outlined"
            value={newRestCity}
            onChange={(e) => setNewRestCity(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="normal" variant="outlined" sx={{ mb: 2 }}>
            <InputLabel id="province-label">Province</InputLabel>
            <Select
              labelId="province-label"
              value={newRestProvince}
              onChange={(e) => setNewRestProvince(e.target.value)}
              label="Province"
              MenuProps={customMenuProps}
            >
              {[
                'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
                'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
                'Prince Edward Island', 'Quebec', 'Saskatchewan',
                'Northwest Territories', 'Nunavut', 'Yukon'
              ].map((province) => (
                <MenuItem key={province} value={province} sx={{ py: 1.2 }}>
                  {province}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button 
            onClick={() => setShowAddRestaurantDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 1.5, px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateNewRestaurant}
            sx={{ borderRadius: 1.5, px: 3 }}
          >
            Save Restaurant
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Success and Error Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: 1.5
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
}

export default AddDealPage;