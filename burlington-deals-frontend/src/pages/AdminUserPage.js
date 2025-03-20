// src/pages/AdminUserPage.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Modal,
  IconButton,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { getAllUsers, updateUserRole, toggleUserActive } from '../services/adminService';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '@mui/material/styles';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const UserSchema = Yup.object().shape({
  role: Yup.string().oneOf(['user', 'admin']).required('Role is required'),
  is_active: Yup.boolean().required('Active status is required'),
});

const AdminUserPage = () => {
  const theme = useTheme();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // For modal

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    setSuccess('');
    try {
      await updateUserRole(selectedUser.user_id, values);
      setSuccess('User updated successfully.');
      fetchUsers();
      setSelectedUser(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    setError('');
    setSuccess('');
    try {
      await toggleUserActive(userId);
      setSuccess('User status updated successfully.');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user status.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin: Manage Users
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TableContainer component={Paper}>
        <Table aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Display Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.user_id}>
                <TableCell>{user.user_id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.display_name}</TableCell>
                <TableCell>
                  <Typography variant="body2" color={user.role === 'admin' ? 'secondary' : 'primary'}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color={user.is_active ? 'success.main' : 'error.main'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Typography>
                </TableCell>
                <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(user)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color={user.is_active ? 'error' : 'success'}
                    size="small"
                    onClick={() => handleToggleActive(user.user_id, user.is_active)}
                  >
                    {user.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit User Modal */}
      <Modal
        open={!!selectedUser}
        onClose={handleCloseModal}
        aria-labelledby="edit-user-modal-title"
        aria-describedby="edit-user-modal-description"
      >
        <Box sx={modalStyle}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography id="edit-user-modal-title" variant="h6" component="h2">
              Edit User
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedUser && (
            <Formik
              initialValues={{
                role: selectedUser.role || 'user',
                is_active: selectedUser.is_active || false,
              }}
              validationSchema={UserSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting, values, handleChange }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="role-select-label">Role</InputLabel>
                        <Field
                          as={Select}
                          labelId="role-select-label"
                          id="role-select"
                          name="role"
                          value={values.role}
                          label="Role"
                          onChange={handleChange}
                          error={touched.role && Boolean(errors.role)}
                        >
                          <MenuItem value="user">User</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </Field>
                        {touched.role && errors.role && (
                          <Typography variant="caption" color="error">
                            {errors.role}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={values.is_active}
                            onChange={handleChange}
                            name="is_active"
                            color="primary"
                          />
                        }
                        label="Active"
                      />
                      {touched.is_active && errors.is_active && (
                        <Typography variant="caption" color="error">
                          {errors.is_active}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                  <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCloseModal}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminUserPage;
