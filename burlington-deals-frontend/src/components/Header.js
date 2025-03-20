// src/components/Header.js
import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import PeopleIcon from '@mui/icons-material/People'; // For "Admin Users" link icon
import { AuthContext } from '../context/AuthContext'; // Ensure AuthContext is correctly imported

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { auth, logout } = useContext(AuthContext);

  /**
   * Dynamically build navItems based on user's authentication and role
   */
  const navItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
  ];

  if (auth.token) {
    // Add "Add Deal" for all authenticated users
    navItems.push(
      { text: 'Add Deal', path: '/add-deal', icon: <AddIcon /> }
    );

    // If admin, add admin-specific links
    if (auth.user?.role === 'admin') {
      navItems.push(
        { text: 'Admin Deals', path: '/admin/deals', icon: <AdminPanelSettingsIcon /> },
        { text: 'Admin Users', path: '/admin/users', icon: <PeopleIcon /> }
      );
    }
  }

  // Toggle for the mobile drawer
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout(); // Logout function from AuthContext
  };

  // Drawer content for mobile
  const drawer = (
    <Box sx={{ width: 240 }}>
      <Box
        sx={{
          p: 2,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Burlington Deals
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={RouterLink}
            to={item.path}
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.light, 0.3)
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}

        {/* If not logged in, show Login & Register */}
        {!auth.token && (
          <>
            <ListItemButton
              component={RouterLink}
              to="/login"
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.light, 0.3)
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>

            <ListItemButton
              component={RouterLink}
              to="/register"
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.light, 0.3)
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <AppRegistrationIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItemButton>
          </>
        )}

        {/* If logged in, show Logout */}
        {auth.token && (
          <ListItemButton
            onClick={handleLogout}
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': {
                bgcolor: alpha(theme.palette.error.light, 0.3)
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" elevation={1} sx={{ bgcolor: 'background.paper' }}>
        <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 700,
              letterSpacing: '-0.5px'
            }}
          >
            Burlington Deals
          </Typography>

          {/* Desktop Nav */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    px: 2,
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.light, 0.3)
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}

              {/* If not logged in, show Login & Register */}
              {!auth.token && (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    startIcon={<LoginIcon />}
                    sx={{
                      px: 2,
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.light, 0.3)
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    startIcon={<AppRegistrationIcon />}
                    sx={{
                      px: 2,
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.light, 0.3)
                      }
                    }}
                  >
                    Register
                  </Button>
                </>
              )}

              {/* If logged in, show Logout */}
              {auth.token && (
                <Button
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    px: 2,
                    color: 'error.main',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.error.light, 0.3)
                    }
                  }}
                >
                  Logout
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box'
          }
        }}
      >
        {drawer}
      </Drawer>

      <Toolbar /> {/* Spacer to push content below the AppBar */}
    </>
  );
};

export default Header;
