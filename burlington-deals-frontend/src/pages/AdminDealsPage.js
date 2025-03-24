// src/pages/AdminDealsPage.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

// Services
import {
  getAllDeals,
  approveDeal,
  promoteDeal,
  unfeatureDeal,
  updateDeal,
  deleteDeal
} from '../services/dealService';

function AdminDealsPage() {
  const theme = useTheme();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Promotion tier dialog
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
  const [promotionId, setPromotionId] = useState(null);
  const [promotionTier, setPromotionTier] = useState(0);
  const [promotionUntil, setPromotionUntil] = useState(dayjs().add(7, 'day'));
  
  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllDeals();
      setDeals(data);
    } catch (error) {
      showSnackbar('Error fetching deals. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);
  
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  const handleEditDeal = (deal) => {
    setSelectedDeal({ ...deal });
    setEditDialogOpen(true);
  };
  
  const handleSaveDeal = async () => {
    try {
      await updateDeal(selectedDeal.deal_id, selectedDeal);
      showSnackbar('Deal updated successfully');
      setEditDialogOpen(false);
      fetchDeals();
    } catch (error) {
      showSnackbar('Error updating deal', 'error');
    }
  };
  
  const handleApproveDeal = async (id) => {
    try {
      await approveDeal(id);
      showSnackbar('Deal approved successfully');
      fetchDeals();
    } catch (error) {
      showSnackbar('Error approving deal', 'error');
    }
  };
  
  const handleOpenPromotionDialog = (id) => {
    setPromotionId(id);
    setPromotionDialogOpen(true);
  };
  
  const handlePromoteDeal = async () => {
    try {
      await promoteDeal(promotionId, promotionUntil.toISOString());
      
      // Set promotion tier if not 0
      if (promotionTier > 0) {
        await fetch(`${process.env.REACT_APP_API_URL}/api/deals/${promotionId}/setPromotionTier`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ promotion_tier: promotionTier })
        });
      }
      
      showSnackbar('Deal promoted successfully');
      setPromotionDialogOpen(false);
      fetchDeals();
    } catch (error) {
      showSnackbar('Error promoting deal', 'error');
    }
  };
  
  const handleUnfeatureDeal = async (id) => {
    try {
      await unfeatureDeal(id);
      showSnackbar('Deal unfeatured successfully');
      fetchDeals();
    } catch (error) {
      showSnackbar('Error unfeaturing deal', 'error');
    }
  };
  
  const handleConfirmDelete = async () => {
    try {
      await deleteDeal(deleteId);
      showSnackbar('Deal deleted successfully');
      setConfirmDeleteOpen(false);
      fetchDeals();
    } catch (error) {
      showSnackbar('Error deleting deal', 'error');
    }
  };
  
  const columns = [
    {
      field: 'restaurant_name',
      headerName: 'Restaurant',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">
            {params.value}
          </Typography>
          {params.row.is_promoted && (
            <Tooltip title="Featured Deal">
              <StarIcon fontSize="small" color="warning" />
            </Tooltip>
          )}
        </Box>
      )
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="secondary" 
          variant="outlined" 
        />
      )
    },
    {
      field: 'day_of_week',
      headerName: 'Day',
      width: 110,
    },
    {
      field: 'is_approved',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const approved = params.value === true;
        return (
          <Chip
            icon={approved ? <CheckCircleIcon /> : <CancelIcon />}
            label={approved ? 'Approved' : 'Pending'}
            color={approved ? 'success' : 'warning'}
            size="small"
          />
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      sortable: false,
      renderCell: (params) => {
        const deal = params.row;
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!deal.is_approved && (
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => handleApproveDeal(deal.deal_id)}
                startIcon={<CheckCircleIcon />}
              >
                Approve
              </Button>
            )}
            
            {deal.is_approved && (
              deal.is_promoted ? (
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  onClick={() => handleUnfeatureDeal(deal.deal_id)}
                  startIcon={<StarBorderIcon />}
                >
                  Unfeature
                </Button>
              ) : (
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => handleOpenPromotionDialog(deal.deal_id)}
                  startIcon={<StarIcon />}
                >
                  Feature
                </Button>
              )
            )}
            
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => handleEditDeal(deal)}
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
            
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => {
                setDeleteId(deal.deal_id);
                setConfirmDeleteOpen(true);
              }}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </Box>
        );
      }
    }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Manage Restaurant Deals
        </Typography>
        
        <Paper sx={{ width: '100%', overflow: 'hidden', mb: 4 }}>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={deals}
              columns={columns}
              getRowId={(row) => row.deal_id}
              loading={loading}
              components={{
                Toolbar: GridToolbar,
                LoadingOverlay: CircularProgress
              }}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
                sorting: {
                  sortModel: [{ field: 'created_at', sort: 'desc' }],
                },
              }}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            />
          </Box>
        </Paper>
        
        {/* Edit Deal Dialog */}
        <Dialog 
          open={editDialogOpen} 
          onClose={() => setEditDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ pb: 1 }}>
            Edit Deal
            <IconButton
              aria-label="close"
              onClick={() => setEditDialogOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent>
            {selectedDeal && (
              <Grid container spacing={3} sx={{ mt: 0 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Restaurant"
                    value={selectedDeal.restaurant_name || ''}
                    InputProps={{ readOnly: true }}
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={selectedDeal.title || ''}
                    onChange={(e) => setSelectedDeal({ ...selectedDeal, title: e.target.value })}
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={selectedDeal.description || ''}
                    onChange={(e) => setSelectedDeal({ ...selectedDeal, description: e.target.value })}
                    multiline
                    rows={3}
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Day of Week</InputLabel>
                    <Select
                      value={selectedDeal.day_of_week || ''}
                      onChange={(e) => setSelectedDeal({ ...selectedDeal, day_of_week: e.target.value })}
                      label="Day of Week"
                    >
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <MenuItem key={day} value={day}>{day}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedDeal.category || ''}
                      onChange={(e) => setSelectedDeal({ ...selectedDeal, category: e.target.value })}
                      label="Category"
                    >
                      {['Pizza', 'Burgers', 'Wings', 'Sushi', 'Italian', 'Mexican', 'Coffee', 'Breakfast', 'Drinks', 'Desserts', 'Other'].map((cat) => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Deal Type</InputLabel>
                    <Select
                      value={selectedDeal.deal_type || 'flat'}
                      onChange={(e) => setSelectedDeal({ ...selectedDeal, deal_type: e.target.value })}
                      label="Deal Type"
                    >
                      <MenuItem value="flat">Flat Price</MenuItem>
                      <MenuItem value="percentage">Percentage Discount</MenuItem>
                      <MenuItem value="event">Special Event</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  {selectedDeal.deal_type === 'flat' ? (
                    <TextField
                      fullWidth
                      label="Price ($)"
                      type="number"
                      value={selectedDeal.flat_price || ''}
                      onChange={(e) => setSelectedDeal({ 
                        ...selectedDeal, 
                        flat_price: e.target.value,
                        price: e.target.value
                      })}
                      InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                      margin="normal"
                    />
                  ) : selectedDeal.deal_type === 'percentage' ? (
                    <TextField
                      fullWidth
                      label="Discount (%)"
                      type="number"
                      value={selectedDeal.percentage_discount || ''}
                      onChange={(e) => setSelectedDeal({ 
                        ...selectedDeal, 
                        percentage_discount: e.target.value
                      })}
                      InputProps={{ inputProps: { min: 0, max: 100, step: 1 } }}
                      margin="normal"
                    />
                  ) : (
                    <TextField
                      fullWidth
                      label="Event"
                      value="Special Event (No Price)"
                      disabled
                      margin="normal"
                    />
                  )}
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Approved Status</InputLabel>
                    <Select
                      value={selectedDeal.is_approved ? 'approved' : 'pending'}
                      onChange={(e) => setSelectedDeal({ 
                        ...selectedDeal, 
                        is_approved: e.target.value === 'approved'
                      })}
                      label="Approved Status"
                    >
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Featured Status</InputLabel>
                    <Select
                      value={selectedDeal.is_promoted ? 'featured' : 'standard'}
                      onChange={(e) => setSelectedDeal({ 
                        ...selectedDeal, 
                        is_promoted: e.target.value === 'featured'
                      })}
                      label="Featured Status"
                    >
                      <MenuItem value="featured">Featured</MenuItem>
                      <MenuItem value="standard">Standard</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Promotion Tier (0-3)"
                    type="number"
                    value={selectedDeal.promotion_tier || 0}
                    onChange={(e) => setSelectedDeal({ 
                      ...selectedDeal, 
                      promotion_tier: parseInt(e.target.value) || 0 
                    })}
                    InputProps={{ inputProps: { min: 0, max: 3, step: 1 } }}
                    margin="normal"
                    helperText="Higher tier = higher visibility (0 = standard)"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="Featured Until"
                    value={selectedDeal.promoted_until ? dayjs(selectedDeal.promoted_until) : null}
                    onChange={(newValue) => setSelectedDeal({ 
                      ...selectedDeal, 
                      promoted_until: newValue ? newValue.toISOString() : null 
                    })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: 'normal',
                        helperText: 'When should featuring end?'
                      },
                    }}
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setEditDialogOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleSaveDeal}
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Confirm Delete Dialog */}
        <Dialog
          open={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this deal? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDeleteOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Promotion Dialog */}
        <Dialog
          open={promotionDialogOpen}
          onClose={() => setPromotionDialogOpen(false)}
        >
          <DialogTitle>Feature This Deal</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 3 }}>
              Set visibility options for this featured deal.
            </DialogContentText>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Promotion Tier</InputLabel>
                  <Select
                    value={promotionTier}
                    onChange={(e) => setPromotionTier(e.target.value)}
                    label="Promotion Tier"
                  >
                    <MenuItem value={0}>Standard Featuring</MenuItem>
                    <MenuItem value={1}>Tier 1 - Category Featured</MenuItem>
                    <MenuItem value={2}>Tier 2 - Homepage Featured</MenuItem>
                    <MenuItem value={3}>Tier 3 - Premium Featured</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <DateTimePicker
                  label="Featured Until"
                  value={promotionUntil}
                  onChange={(newValue) => setPromotionUntil(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      helperText: 'When should featuring end?'
                    },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPromotionDialogOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button onClick={handlePromoteDeal} color="primary" variant="contained">
              Feature Deal
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Snackbar for notifications */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}

export default AdminDealsPage;