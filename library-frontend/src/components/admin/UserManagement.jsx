import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert
} from '@mui/material';
import api from '../../services/api';

const ROLES = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Librarian' },
  { id: 3, name: 'Member' }
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role_id: 1 // Default to admin
  });
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState(3); // Default to Member

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        ...formData,
        role_id: selectedRole // Make sure we're sending the role_id
      };
      await api.post('/auth/admin/register', userData);
      setOpenDialog(false);
      fetchUsers();
      setFormData({ username: '', email: '', password: '', role_id: 3 });
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleRoleChange = async (userId, newRoleId) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { roleId: newRoleId });
      fetchUsers();
    } catch (error) {
      setError('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
      } catch (error) {
        setError('Failed to delete user');
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            User Management
          </Typography>
          
          <Button 
            variant="contained" 
            onClick={() => setOpenDialog(true)}
            sx={{ mb: 3 }}
          >
            Add New Admin
          </Button>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      value={user.role_id}
                      onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                      size="small"
                    >
                      {ROLES.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color={user.is_active ? "success" : "warning"}
                      onClick={() => handleToggleStatus(user.user_id)}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      color="secondary"
                      onClick={() => handleDeleteUser(user.user_id)}
                    >
                      Delete
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleResetPassword(user.user_id)}
                    >
                      Reset Password
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Add New Admin User</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                margin="normal"
                required
              />
              <TextField
                select
                fullWidth
                label="Role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                margin="normal"
                required
              >
                {ROLES.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </TextField>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">Add Admin</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default UserManagement; 