import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationSystem from './notifications/NotificationSystem';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const closeMobileMenu = () => {
    setMobileMenuAnchor(null);
  };

  return (
    <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'white', px: 2 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            LIBRARY
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Button color="primary" onClick={() => navigate('/books')}>
              Browse
            </Button>
            {user && (
              <>
                <Button color="primary" onClick={() => navigate('/my-loans')}>
                  My Loans
                </Button>
                {user.role === 'admin' && (
                  <>
                    <Button color="primary" onClick={() => navigate('/admin')}>
                      Admin
                    </Button>
                    <Button color="primary" onClick={() => navigate('/reports')}>
                      Reports
                    </Button>
                  </>
                )}
              </>
            )}
            {/* Notifications */}
            {user && <NotificationSystem />}

            {/* Profile Menu */}
            {user ? (
              <>
                <IconButton onClick={handleMenu} color="primary">
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {user.username[0].toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                  <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
                  <Divider />
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button variant="outlined" color="primary" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button variant="contained" color="primary" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton onClick={handleMobileMenu} color="primary">
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Menu Items */}
      <Menu anchorEl={mobileMenuAnchor} open={Boolean(mobileMenuAnchor)} onClose={closeMobileMenu}>
        {user && (
          <>
            {user.role === 'admin' && (
              <MenuItem onClick={() => { navigate('/admin'); closeMobileMenu(); }}>
                Admin Dashboard
              </MenuItem>
            )}
            {user.role === 'librarian' && (
              <MenuItem onClick={() => { navigate('/librarian'); closeMobileMenu(); }}>
                Librarian Dashboard
              </MenuItem>
            )}
            <MenuItem onClick={() => { navigate('/books'); closeMobileMenu(); }}>
              Books
            </MenuItem>
            {user.role === 'member' && (
              <MenuItem onClick={() => { navigate('/my-loans'); closeMobileMenu(); }}>
                My Loans
              </MenuItem>
            )}
          </>
        )}
        {!user && (
          <>
            <MenuItem onClick={() => { navigate('/login'); closeMobileMenu(); }}>
              Login
            </MenuItem>
            <MenuItem onClick={() => { navigate('/register'); closeMobileMenu(); }}>
              Register
            </MenuItem>
          </>
        )}
      </Menu>
    </AppBar>
  );
};

export default Navbar;
