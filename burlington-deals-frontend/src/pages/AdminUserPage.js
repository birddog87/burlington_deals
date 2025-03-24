// src/pages/AdminUserPage.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  useTheme
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import { getAllUsers, updateUserRole, toggleUserActive } from '../services/adminService';

function AdminUserPage() {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      showSnackbar('Error fetching users. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  const handleEditUser = (user) => {
    setSelectedUser({
      ...user,
      newRole: user.role, 
      newActiveStatus: user.is_active
    });
    setEditDialogOpen(true);
  };
  
  const handleUpdateUser = async () => {
    try {
      // Update role if changed
      if (selectedUser.newRole !== selectedUser.role) {
        await updateUserRole(selectedUser.user_id, selectedUser.newRole);
      }
      
      // Toggle active status if changed
      if (selectedUser.newActiveStatus !== selectedUser.is_active) {
        await toggleUserActive(selectedUser.user_id);
      }
      
      showSnackbar('User updated successfully');
      setEditDialogOpen(false);
      fetchUsers();
    } catch (error) {
      showSnackbar('Error updating user', 'error');
    }
  };
  
  const handleToggleActive = async (userId, currentStatus) => {
    try {
      await toggleUserActive(userId);
      showSnackbar(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (error) {
      showSnackbar('Error updating user status', 'error');
    }
  };
  
  const columns = [
    { 
      field: 'user_id', 
      headerName: 'ID', 
      width: 80 
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      flex: 1 
    },
    { 
      field: 'display_name', 
      headerName: 'Display Name', 
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value || 'Not set'}
        </Typography>
      )
    },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 120,
      renderCell: (params) => (
        <Chip
          icon={params.value === 'admin' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
          label={params.value === 'admin' ? 'Admin' : 'User'}
          color={params.value === 'admin' ? 'secondary' : 'default'}
          size="small"
        />
      )
    },
    { 
      field: 'is_active', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip
          icon={params.value ? <CheckCircleIcon /> : <BlockIcon />}
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'error'}
          size="small"
        />
      )
    },
    { 
      field: 'created_at', 
      headerName: 'Created', 
      width: 180,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const user = params.row;
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => handleEditUser(user)}
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
            
            <Button
              size="small"
              variant="outlined"
              color={user.is_active ? 'error' : 'success'}
              onClick={() => handleToggleActive(user.user_id, user.is_active)}
              startIcon={user.is_active ? <BlockIcon /> : <CheckCircleIcon />}
            >
              {user.is_active ? 'Deactivate' : 'Activate'}
            </Button>
          </Box>
        );
      }
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Manage Users
      </Typography>
      
      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 4 }}>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={users}
            columns={columns}
            getRowId={(row) => row.user_id}
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
      
      {/* Edit User Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ pb: 1 }}>
          Edit User
          <IconButton
            aria-label="close"
            onClick={() => setEditDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                User: {selectedUser.email}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                User ID: {selectedUser.user_id}
              </Typography>
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedUser.newRole || selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, newRole: e.target.value })}
                  label="Role"
                >
                  <MenuItem value="user">Regular User</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedUser.newActiveStatus !== undefined ? selectedUser.newActiveStatus : selectedUser.is_active}
                    onChange={(e) => setSelectedUser({ ...selectedUser, newActiveStatus: e.target.checked })}
                    color={selectedUser.newActiveStatus !== undefined ? 
                      (selectedUser.newActiveStatus ? 'success' : 'error') : 
                      (selectedUser.is_active ? 'success' : 'error')}
                  />
                }
                label={selectedUser.newActiveStatus !== undefined ? 
                  (selectedUser.newActiveStatus ? 'Active' : 'Inactive') : 
                  (selectedUser.is_active ? 'Active' : 'Inactive')}
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateUser}
            variant="contained"
            color="primary"
          >
            Save Changes
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
  );
}

export default AdminUserPage;