// src/pages/AddDealPage.js
import React, { useState, useEffect, useCallback } from 'react';
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
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { createDeal } from '../services/dealService';
import { searchRestaurants, createRestaurant } from '../services/restaurantService';
// We won't redirect to homepage, so no need for useNavigate
// import { useNavigate } from 'react-router-dom';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const CATEGORIES = [
  'Wings',
  'Beer',
  'Wine',
  'Cocktails',
  'Appetizers',
  'Entrees',
  'Desserts',
  'Happy Hour',
  'Tacos',
  'Fish & Chips',
  'Burgers',
  'Pizza',
  'Other'  // If "Other," show a custom text field
];

const WINGS_PER_POUND = 10;

// For the MUI multi-select style so text doesn't get cut off
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
      width: 250,
      backgroundColor: '#333', // Dark background for menu
      color: '#fff',
    },
  },
};

function AddDealPage() {
  // Instead of a single day, we store multiple days
  const [formData, setFormData] = useState({
    restaurant_id: '',
    restaurant_name: '',
    title: '',
    description: '',
    price: '',
    day_of_week: [],  // multiple days
    category: '',
    second_category: '',
    customCategory: '', // if they choose "Other"
    start_time: null,
    end_time: null,
    is_recurring: true,
    wing_price_unit: 'per_wing'
  });

  const [restaurantOptions, setRestaurantOptions] = useState([]);
  const [restaurantLoading, setRestaurantLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(false);

  // Remove existing success and error message states
  // const [successMessage, setSuccessMessage] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');

  // Snackbar state variables
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'

  // For adding new restaurant if not found
  const [showAddRestaurantDialog, setShowAddRestaurantDialog] = useState(false);
  const [newRestName, setNewRestName] = useState('');
  const [newRestCity, setNewRestCity] = useState('');
  const [newRestProvince, setNewRestProvince] = useState('');
  const [newRestAddress, setNewRestAddress] = useState('');

  // =============== RESTAURANT SEARCH ===============
  const handleSearchRestaurants = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    // If < 2 chars, clear
    if (!query || query.length < 2) {
      setRestaurantOptions([]);
      return;
    }
    setRestaurantLoading(true);
    try {
      const results = await searchRestaurants(query);
      setRestaurantOptions(results);
    } catch (err) {
      console.error('Error searching restaurants:', err);
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
      // setErrorMessage('Please fill in all required fields.');
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

      // Replace showSnackbar with setSuccessMessage
      // setSuccessMessage('🎉 Thank you for submitting your restaurant! It will be reviewed and should be up in 24-48 hours.');
      showSnackbar('🎉 Thank you for submitting your restaurant! It will be reviewed and should be up in 24-48 hours.', 'success');
    } catch (err) {
      console.error('Error creating new restaurant:', err);
      // setErrorMessage('Failed to create new restaurant. Please try again.');
      showSnackbar('Failed to create new restaurant. Please try again.', 'error');
    }
  };

  // =============== DAY MULTI-SELECTION ===============
  const handleDayChange = (event) => {
    const { value } = event.target;
    // If the user selected "Every Day", fill all
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

  // =============== FORM LOGIC ===============
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
    // setErrorMessage('');
    // setSuccessMessage('');
    // Clear any existing snackbars
    // Optionally, you can show a loading snackbar if desired

    // If category = "Other," use the customCategory
    let finalCategory = formData.category;
    if (finalCategory === 'Other') {
      finalCategory = formData.customCategory.trim() || 'Other';
    }

    // If category = "Wings," handle price_per_wing
    let price_per_wing = null;
    if (formData.category === 'Wings') {
      if (formData.wing_price_unit === 'per_wing') {
        price_per_wing = parseFloat(formData.price);
      } else {
        price_per_wing = parseFloat(formData.price) / WINGS_PER_POUND;
      }
    }

    // For multiple days, create multiple records
    if (!formData.day_of_week || formData.day_of_week.length === 0) {
      // setErrorMessage('Please select at least one day of the week.');
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

      // setSuccessMessage('Deal(s) submitted successfully! You can add more deals if you’d like.');
      showSnackbar('Deal(s) submitted successfully! You can add more deals if you’d like.', 'success');

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
      console.error(err);
      // setErrorMessage('Failed to submit deal. Please try again.');
      showSnackbar('Failed to submit deal. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // =============== Snackbar Functions ===============
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          maxWidth: 600,
          mx: 'auto',
          mt: 3,
          mb: 8,
          px: 2,
          width: '100%', // Mobile-friendly
        }}
      >
        <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper' }}>
          <Typography variant="h5" gutterBottom>
            Add a New Deal
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Fill out the details below. If your restaurant does not exist, click "Add New Restaurant."
            If the deal runs multiple days, select them all below (with checkboxes) or choose "Every Day".
          </Typography>

          {/* Removed existing Alert components */}
          {/* {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )} */}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Restaurant Field (with search + add new) */}
            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Restaurant
            </Typography>
            <TextField
              fullWidth
              placeholder="Type to search or add restaurant..."
              value={searchTerm}
              onChange={handleSearchRestaurants}
              margin="normal"
              variant="outlined"
            />
            {restaurantLoading && <CircularProgress size={20} />}
            {restaurantOptions.length > 0 && (
              <Paper
                sx={{
                  maxHeight: 150,
                  overflow: 'auto',
                  mb: 1,
                  mt: 1,
                  backgroundColor: '#333',
                  color: '#fff',
                }}
                elevation={4}
              >
                {restaurantOptions.map((r) => (
                  <Box
                    key={r.restaurant_id}
                    sx={{
                      p: 1.5,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 150, 136, 0.2)',
                      },
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
              size="small"
              sx={{ mb: 2 }}
              onClick={() => setShowAddRestaurantDialog(true)}
            >
              Add New Restaurant
            </Button>

            {/* Title */}
            <TextField
              label="Deal Title"
              name="title"
              fullWidth
              required
              value={formData.title}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
            />

            {/* Description */}
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
            />

            {/* Price */}
            <TextField
              label="Price"
              name="price"
              fullWidth
              value={formData.price}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
            />

            {/* Day of Week (multi-select with checkboxes) */}
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel id="day-of-week-label">Day(s) of Week</InputLabel>
              <Select
                labelId="day-of-week-label"
                multiple
                value={formData.day_of_week}
                onChange={handleDayChange}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
                label="Day(s) of Week"
              >
                <MenuItem value="Every Day">
                  <Checkbox checked={formData.day_of_week.length === DAYS_OF_WEEK.length} />
                  <ListItemText primary="Every Day" />
                </MenuItem>
                {DAYS_OF_WEEK.map((day) => (
                  <MenuItem key={day} value={day}>
                    <Checkbox checked={formData.day_of_week.indexOf(day) > -1} />
                    <ListItemText primary={day} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Category */}
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel id="category-label">Primary Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                MenuProps={MenuProps}
                label="Primary Category"
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* If "Other," ask for custom category name */}
            {formData.category === 'Other' && (
              <TextField
                label="Custom Category"
                name="customCategory"
                fullWidth
                value={formData.customCategory}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />
            )}

            {/* Secondary Category */}
            <TextField
              label="Secondary Category"
              name="second_category"
              fullWidth
              value={formData.second_category}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
            />

            {/* If Wings, show the price-per-wing vs per-pound radio */}
            {formData.category === 'Wings' && (
              <FormControl component="fieldset" margin="normal">
                <RadioGroup
                  row
                  name="wing_price_unit"
                  value={formData.wing_price_unit}
                  onChange={handleInputChange}
                >
                  <FormControlLabel value="per_wing" control={<Radio />} label="Price per Wing" />
                  <FormControlLabel value="per_pound" control={<Radio />} label="Price per Pound" />
                </RadioGroup>
              </FormControl>
            )}

            {/* Start & End Times */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TimePicker
                label="Start Time"
                value={formData.start_time ? dayjs(formData.start_time, 'HH:mm:ss') : null}
                onChange={handleTimeChange('start_time')}
                slotProps={{
                  textField: {
                    variant: 'outlined',
                    fullWidth: true,
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
                  },
                }}
              />
            </Box>

            {/* Recurring? */}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_recurring}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_recurring: e.target.checked }))
                  }
                />
              }
              label="This is a recurring deal"
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading && <CircularProgress size="1rem" color="inherit" />}
              >
                {loading ? 'Submitting...' : 'Submit Deal'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Dialog to add a new restaurant */}
      <Dialog open={showAddRestaurantDialog} onClose={() => setShowAddRestaurantDialog(false)}>
        <DialogTitle>Add a New Restaurant</DialogTitle>
        <DialogContent>
          <TextField
            label="Restaurant Name"
            fullWidth
            margin="normal"
            variant="outlined"
            value={newRestName}
            onChange={(e) => setNewRestName(e.target.value)}
          />
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            variant="outlined"
            value={newRestAddress}
            onChange={(e) => setNewRestAddress(e.target.value)}
          />
          <TextField
            label="City"
            fullWidth
            margin="normal"
            variant="outlined"
            value={newRestCity}
            onChange={(e) => setNewRestCity(e.target.value)}
          />
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel id="province-label">Province</InputLabel>
            <Select
              labelId="province-label"
              value={newRestProvince}
              onChange={(e) => setNewRestProvince(e.target.value)}
              label="Province"
            >
              {[
                'Alberta',
                'British Columbia',
                'Manitoba',
                'New Brunswick',
                'Newfoundland and Labrador',
                'Nova Scotia',
                'Ontario',
                'Prince Edward Island',
                'Quebec',
                'Saskatchewan',
                'Northwest Territories',
                'Nunavut',
                'Yukon'
              ].map((province) => (
                <MenuItem key={province} value={province}>
                  {province}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddRestaurantDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleCreateNewRestaurant}>
            Save
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
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
}

export default AddDealPage;