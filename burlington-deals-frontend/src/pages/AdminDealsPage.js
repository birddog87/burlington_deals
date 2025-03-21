// src/pages/AdminDealsPage.js

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Modal,
  Paper,
  Grid,
  TextField,
  Chip,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Slide,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  InputLabel,
  useMediaQuery
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import dayjs from 'dayjs';

import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UndoIcon from '@mui/icons-material/Undo';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import {
  getAllDeals,
  approveDeal,
  promoteDeal,
  unfeatureDeal,
  updateDeal,
  deleteDeal
} from '../services/dealService';

import API from '../services/api'; // for setPromotionTier

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: 700 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '12px',
  p: 3
};

const snackbarTransition = (props) => <Slide {...props} direction="left" />;

function AdminDealsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, dealId: null });

  // For "Promote Tier" modal
  const [tierModalOpen, setTierModalOpen] = useState(false);
  const [tierDealId, setTierDealId] = useState(null);
  const [promotionTier, setPromotionTier] = useState(0);

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllDeals();
      setDeals(data);
    } catch (err) {
      showSnackbar('Failed to fetch deals. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // =============== CRUD Actions ===============
  const handlePromote = (dealId) => {
    // Instead of automatically promoting, open the "Set Promotion Tier" modal
    setTierDealId(dealId);
    setTierModalOpen(true);
    // you can still do the old approach of dayjs().add(7, 'day') if you want
  };

  const handleUnfeature = async (dealId) => {
    try {
      await unfeatureDeal(dealId);
      showSnackbar('Deal removed from featured.', 'success');
      fetchDeals();
    } catch (err) {
      showSnackbar('Failed to remove featured status.', 'error');
    }
  };

  const handleApprove = async (dealId) => {
    try {
      await approveDeal(dealId);
      showSnackbar('Deal approved successfully.', 'success');
      fetchDeals();
    } catch (err) {
      showSnackbar('Failed to approve deal.', 'error');
    }
  };

  const handleEdit = (deal) => {
    setSelectedDeal(deal);
  };

  const handleCloseModal = () => {
    setSelectedDeal(null);
  };

  const handleDelete = (dealId) => {
    setDeleteConfirm({ open: true, dealId });
  };

  const confirmDelete = async () => {
    try {
      await deleteDeal(deleteConfirm.dealId);
      showSnackbar('Deal deleted successfully.', 'success');
      fetchDeals();
    } catch (err) {
      showSnackbar('Failed to delete deal.', 'error');
    } finally {
      setDeleteConfirm({ open: false, dealId: null });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ open: false, dealId: null });
  };

  // =============== Save Changes in the Edit Modal ===============
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!selectedDeal) return;

    try {
      // Allowed fields
      const allowedFields = [
        'title',
        'description',
        'deal_type',
        'price_type',
        'price',
        'day_of_week',
        'category',
        'second_category',
        'start_time',
        'end_time',
        'is_promoted',
        'promoted_until',
        'is_approved',
        'price_per_wing',
        'percentage_discount',
        'promotion_tier'
      ];
      const updatedData = Object.fromEntries(
        Object.entries(selectedDeal).filter(([key]) => allowedFields.includes(key))
      );

      if (updatedData.deal_type === 'flat') {
        updatedData.percentage_discount = null;
        updatedData.flat_price =
          updatedData.price != null ? parseFloat(updatedData.price) : null;
        if (isNaN(updatedData.flat_price) || updatedData.flat_price < 0) {
          return showSnackbar('Invalid price for flat deal.', 'error');
        }
      } else if (updatedData.deal_type === 'percentage') {
        updatedData.flat_price = null;
        if (updatedData.percentage_discount != null) {
          updatedData.percentage_discount = parseFloat(updatedData.percentage_discount);
          if (
            isNaN(updatedData.percentage_discount) ||
            updatedData.percentage_discount <= 0 ||
            updatedData.percentage_discount > 100
          ) {
            return showSnackbar('Invalid percentage discount.', 'error');
          }
        } else {
          updatedData.percentage_discount = null;
        }
      } else if (updatedData.deal_type === 'event') {
        updatedData.price = 0.0;
        updatedData.flat_price = null;
        updatedData.percentage_discount = null;
      }

      await updateDeal(selectedDeal.deal_id, updatedData);
      showSnackbar('Deal updated successfully.', 'success');
      fetchDeals();
      handleCloseModal();
    } catch (err) {
      showSnackbar('Failed to update deal.', 'error');
    }
  };

  // =============== Confirm Tier Modal ===============
  const handleTierModalSubmit = async () => {
    if (!tierDealId) return;
    try {
      await API.put(`/deals/${tierDealId}/setPromotionTier`, {
        promotion_tier: promotionTier
      });
      showSnackbar(`Deal updated to Tier ${promotionTier} successfully.`, 'success');
      fetchDeals();
    } catch (err) {
      showSnackbar('Failed to set promotion tier.', 'error');
    } finally {
      setTierModalOpen(false);
      setTierDealId(null);
      setPromotionTier(0);
    }
  };

  const handleTierModalClose = () => {
    setTierModalOpen(false);
    setTierDealId(null);
    setPromotionTier(0);
  };

  // =============== DataGrid Columns ===============
  const columns = [
    {
      field: 'restaurant_name',
      headerName: 'Restaurant',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2">{params.value}</Typography>
          {params.row.is_promoted && (
            <Tooltip title="Featured Deal">
              <StarIcon color="warning" />
            </Tooltip>
          )}
        </Box>
      )
    },
    {
      field: 'day_of_week',
      headerName: 'Day',
      width: 100,
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="primary" variant="outlined" />
      )
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 110,
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="secondary" variant="contained" />
      )
    },
    {
      field: 'priceDiscount',
      headerName: 'Price/Discount',
      width: 130,
      renderCell: (params) => {
        const row = params.row;
        if (!row || !row.deal_type) {
          return 'N/A';
        }
        switch (row.deal_type) {
          case 'flat':
            return row.flat_price
              ? `$${parseFloat(row.flat_price).toFixed(2)}`
              : 'N/A';
          case 'percentage':
            return row.percentage_discount
              ? `${row.percentage_discount}% off`
              : 'N/A';
          case 'event':
            return 'Event';
          default:
            return 'N/A';
        }
      }
    },
    {
      field: 'description',
      headerName: 'Details',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        const desc = params.value || '';
        return (
          <Tooltip title={desc}>
            <Typography
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%'
              }}
              variant="body2"
            >
              {desc}
            </Typography>
          </Tooltip>
        );
      }
    },
    {
      field: 'is_approved',
      headerName: 'Status',
      width: 110,
      renderCell: (params) => {
        const approved = params.value === true;
        return approved ? (
          <Chip label="Approved" color="success" icon={<CheckCircleIcon />} size="small" />
        ) : (
          <Chip label="Pending" color="warning" icon={<UndoIcon />} size="small" />
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      // made wider so they don't overlap
      width: isMobile ? 320 : 500,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const row = params.row;
        const approved = row.is_approved === true;
        return (
          <Box display="flex" gap={1} flexWrap="wrap">
            {!approved && (
              <Tooltip title="Approve Deal">
                <Button
                  startIcon={<ThumbUpAltIcon />}
                  color="success"
                  onClick={() => handleApprove(row.deal_id)}
                  size="small"
                  variant="contained"
                >
                  Approve
                </Button>
              </Tooltip>
            )}
            {approved && row.is_promoted ? (
              <Tooltip title="Remove from Featured">
                <Button
                  startIcon={<RemoveDoneIcon />}
                  color="warning"
                  onClick={() => handleUnfeature(row.deal_id)}
                  size="small"
                  variant="contained"
                >
                  Unfeature
                </Button>
              </Tooltip>
            ) : approved ? (
              <Tooltip title="Promote / Set Tier">
                <Button
                  startIcon={<FeaturedPlayListIcon />}
                  color="primary"
                  onClick={() => handlePromote(row.deal_id)}
                  size="small"
                  variant="contained"
                >
                  Promote
                </Button>
              </Tooltip>
            ) : null}
            <Tooltip title="Edit Deal">
              <Button
                startIcon={<EditIcon />}
                color="info"
                onClick={() => handleEdit(row)}
                size="small"
                variant="outlined"
              >
                Edit
              </Button>
            </Tooltip>
            <Tooltip title="Delete Deal">
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                onClick={() => handleDelete(row.deal_id)}
                size="small"
                variant="outlined"
              >
                Delete
              </Button>
            </Tooltip>
          </Box>
        );
      }
    }
  ];

  return (
    <Box sx={{ p: isMobile ? 2 : 3, minHeight: '80vh' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Deals
      </Typography>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        TransitionComponent={snackbarTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Confirm Delete Dialog */}
      <Dialog open={deleteConfirm.open} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this deal? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* DataGrid */}
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          mt: 2,
          p: 1
        }}
      >
        <DataGrid
          rows={deals}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
          loading={loading}
          getRowId={(row) => row.deal_id}
          disableSelectionOnClick
          autoHeight
          components={{
            Toolbar: GridToolbar,
            LoadingOverlay: () => (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  zIndex: 1
                }}
              >
                <CircularProgress />
              </Box>
            )
          }}
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none'
            },
            '.MuiDataGrid-row': {
              maxHeight: '52px !important'
            }
          }}
        />
      </Paper>

      {/* Edit Deal Modal */}
      <Modal open={!!selectedDeal} onClose={handleCloseModal}>
        <Box sx={modalStyle} component="form" onSubmit={handleSaveChanges}>
          <Typography variant="h6" component="h2" gutterBottom>
            Edit Deal
          </Typography>

          {selectedDeal && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={2}>
                {/* Restaurant Name (read-only) */}
                <Grid item xs={12}>
                  <TextField
                    label="Restaurant Name"
                    value={selectedDeal.restaurant_name || ''}
                    InputProps={{
                      readOnly: true
                    }}
                    fullWidth
                  />
                </Grid>
                {/* Restaurant ID (disabled) */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Restaurant ID"
                    value={selectedDeal.restaurant_id || ''}
                    disabled
                    fullWidth
                  />
                </Grid>
                {/* Title */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Title"
                    value={selectedDeal.title || ''}
                    onChange={(e) =>
                      setSelectedDeal((prev) => ({ ...prev, title: e.target.value }))
                    }
                    fullWidth
                    required
                  />
                </Grid>
                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    value={selectedDeal.description || ''}
                    onChange={(e) =>
                      setSelectedDeal((prev) => ({ ...prev, description: e.target.value }))
                    }
                    multiline
                    minRows={3}
                    fullWidth
                    required
                  />
                </Grid>
                {/* Deal Type */}
                <Grid item xs={12} sm={6}>
                  <FormControl component="fieldset" fullWidth required>
                    <InputLabel id="deal-type-label">Deal Type</InputLabel>
                    <Select
                      labelId="deal-type-label"
                      label="Deal Type"
                      value={selectedDeal.deal_type || 'flat'}
                      onChange={(e) =>
                        setSelectedDeal((prev) => ({
                          ...prev,
                          deal_type: e.target.value
                        }))
                      }
                    >
                      <MenuItem value="flat">Flat Discount</MenuItem>
                      <MenuItem value="percentage">Percentage Discount</MenuItem>
                      <MenuItem value="event">Event</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {/* Price Type - Conditional */}
                <Grid item xs={12} sm={6}>
                  {selectedDeal.deal_type !== 'event' && (
                    <FormControl component="fieldset" fullWidth required>
                      <Typography variant="subtitle1">Price Type</Typography>
                      <RadioGroup
                        row
                        value={
                          selectedDeal.price_type ||
                          (selectedDeal.deal_type === 'flat'
                            ? 'fixed'
                            : 'percentage')
                        }
                        onChange={(e) =>
                          setSelectedDeal((prev) => ({
                            ...prev,
                            price_type: e.target.value
                          }))
                        }
                      >
                        {selectedDeal.deal_type === 'flat' ? (
                          <FormControlLabel
                            value="fixed"
                            control={<Radio />}
                            label="Fixed"
                          />
                        ) : selectedDeal.deal_type === 'percentage' ? (
                          <FormControlLabel
                            value="percentage"
                            control={<Radio />}
                            label="Percentage"
                          />
                        ) : null}
                      </RadioGroup>
                    </FormControl>
                  )}
                </Grid>
                {/* Price - Conditional */}
                {selectedDeal.deal_type !== 'event' && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={
                        selectedDeal.deal_type === 'flat'
                          ? 'Flat Price ($)'
                          : 'Percentage Discount (%)'
                      }
                      type="number"
                      inputProps={
                        selectedDeal.deal_type === 'flat'
                          ? { step: '0.01', min: '0' }
                          : { step: '0.1', min: '0', max: '100' }
                      }
                      value={
                        selectedDeal.deal_type === 'flat'
                          ? selectedDeal.flat_price != null
                            ? selectedDeal.flat_price
                            : ''
                          : selectedDeal.percentage_discount != null
                          ? selectedDeal.percentage_discount
                          : ''
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedDeal((prev) => {
                          if (prev.deal_type === 'flat') {
                            return {
                              ...prev,
                              flat_price: value,
                              price: value
                            };
                          } else if (prev.deal_type === 'percentage') {
                            return {
                              ...prev,
                              percentage_discount: value
                            };
                          } else {
                            return prev;
                          }
                        });
                      }}
                      fullWidth
                      required
                    />
                  </Grid>
                )}
                {/* Price - Flat Deals */}
                {selectedDeal.deal_type === 'flat' && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Price ($)"
                      type="number"
                      inputProps={{ step: '0.01', min: '0' }}
                      value={selectedDeal.flat_price || ''}
                      onChange={(e) =>
                        setSelectedDeal((prev) => ({
                          ...prev,
                          flat_price: e.target.value,
                          price: e.target.value
                        }))
                      }
                      fullWidth
                      required
                    />
                  </Grid>
                )}
                {/* Price - Percentage Deals */}
                {selectedDeal.deal_type === 'percentage' && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Price ($)"
                      type="number"
                      inputProps={{ step: '0.01', min: '0' }}
                      value={0.0}
                      disabled
                      fullWidth
                      helperText="Price is not applicable for percentage discounts."
                    />
                  </Grid>
                )}
                {/* Day of Week */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Day of Week"
                    value={selectedDeal.day_of_week || ''}
                    onChange={(e) =>
                      setSelectedDeal((prev) => ({
                        ...prev,
                        day_of_week: e.target.value
                      }))
                    }
                    fullWidth
                    required
                  >
                    {[
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                      'Sunday'
                    ].map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                {/* Category */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Category"
                    value={selectedDeal.category || ''}
                    onChange={(e) =>
                      setSelectedDeal((prev) => ({
                        ...prev,
                        category: e.target.value
                      }))
                    }
                    fullWidth
                    required
                  >
                    <MenuItem value="">Select Category</MenuItem>
                    <MenuItem value="Wings">Wings</MenuItem>
                    <MenuItem value="Appetizers">Appetizers</MenuItem>
                    <MenuItem value="Combos">Combos</MenuItem>
                    <MenuItem value="Pasta">Pasta</MenuItem>
                    <MenuItem value="Breakfast">Breakfast</MenuItem>
                    <MenuItem value="Drinks">Drinks</MenuItem>
                    <MenuItem value="Food">Food</MenuItem>
                    {/* etc */}
                  </TextField>
                </Grid>
                {/* Second Category */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Second Category"
                    value={selectedDeal.second_category || ''}
                    onChange={(e) =>
                      setSelectedDeal((prev) => ({
                        ...prev,
                        second_category: e.target.value
                      }))
                    }
                    fullWidth
                  />
                </Grid>
                {/* Start Time */}
                <Grid item xs={12} sm={6}>
                  <TimePicker
                    label="Start Time"
                    value={
                      selectedDeal.start_time
                        ? dayjs(selectedDeal.start_time, 'HH:mm:ss')
                        : null
                    }
                    onChange={(newVal) =>
                      setSelectedDeal((prev) => ({
                        ...prev,
                        start_time: newVal ? newVal.format('HH:mm:ss') : null
                      }))
                    }
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                {/* End Time */}
                <Grid item xs={12} sm={6}>
                  <TimePicker
                    label="End Time"
                    value={
                      selectedDeal.end_time
                        ? dayjs(selectedDeal.end_time, 'HH:mm:ss')
                        : null
                    }
                    onChange={(newVal) =>
                      setSelectedDeal((prev) => ({
                        ...prev,
                        end_time: newVal ? newVal.format('HH:mm:ss') : null
                      }))
                    }
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                {/* Promoted Until */}
                {selectedDeal.deal_type !== 'event' && (
                  <Grid item xs={12} sm={6}>
                    <DateTimePicker
                      label="Promoted Until"
                      value={
                        selectedDeal.promoted_until
                          ? dayjs(selectedDeal.promoted_until)
                          : null
                      }
                      onChange={(newVal) =>
                        setSelectedDeal((prev) => ({
                          ...prev,
                          promoted_until: newVal ? newVal.toISOString() : null
                        }))
                      }
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                )}
                {/* Price Per Wing */}
                {selectedDeal.category === 'Wings' && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Price per Wing ($)"
                      type="number"
                      inputProps={{ step: '0.01', min: '0' }}
                      value={selectedDeal.price_per_wing || ''}
                      onChange={(e) =>
                        setSelectedDeal((prev) => ({
                          ...prev,
                          price_per_wing: e.target.value
                        }))
                      }
                      fullWidth
                      required
                    />
                  </Grid>
                )}
              </Grid>
            </LocalizationProvider>
          )}

          <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseModal}
              startIcon={<CloseIcon />}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />}>
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Promotion Tier Modal */}
      <Dialog open={tierModalOpen} onClose={handleTierModalClose}>
        <DialogTitle>Set Promotion Tier</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Choose a tier (0 = none, 1 = category, 2 = bigger, 3 = universal, etc.).
          </DialogContentText>
          <TextField
            type="number"
            label="Promotion Tier"
            value={promotionTier}
            onChange={(e) => setPromotionTier(Number(e.target.value))}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTierModalClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleTierModalSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminDealsPage;
