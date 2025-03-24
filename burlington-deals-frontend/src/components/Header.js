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
  ListItemText,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { auth, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  // Check if user is admin
  const isAdmin = auth.user && auth.user.role === 'admin';

  // Add console log for debugging
  console.log("Auth state in Header:", auth);
  console.log("Is admin?", isAdmin);

  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'All Deals', path: '/all-deals' },
    { text: 'Restaurants', path: '/restaurants' },
    { text: 'Submit a Deal', path: '/submit-deal' },
  ];

  // Admin navigation items
  const adminItems = [
    { text: 'Admin Dashboard', path: '/admin', icon: <DashboardIcon /> },
    { text: 'Manage Deals', path: '/admin/deals', icon: <AdminPanelSettingsIcon /> },
    { text: 'Manage Users', path: '/admin/users', icon: <AdminPanelSettingsIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        color="transparent" 
        elevation={0}
        sx={{ 
          bgcolor: darkMode ? '#121212' : '#FFFFFF',
          borderBottom: `1px solid ${darkMode ? '#333333' : '#EEEEEE'}`
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontWeight: 700,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              color: 'text.primary',
              textDecoration: 'none',
            }}
          >
            Burlington<span style={{ color: theme.palette.primary.main }}>Deals</span>
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}

              {/* Admin Menu Items - only show if user is admin */}
              {isAdmin && (
                <Button
                  component={RouterLink}
                  to="/admin"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    },
                  }}
                >
                  Admin Dashboard
                </Button>
              )}
              
              {/* Theme toggle */}
              <IconButton onClick={toggleDarkMode} sx={{ ml: 1 }}>
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              
              {/* Login / Sign Up */}
              {!auth.token ? (
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{
                    ml: 2,
                    color: 'text.primary',
                  }}
                >
                  Sign In
                </Button>
              ) : (
                <Button
                  onClick={logout}
                  sx={{
                    ml: 2,
                    color: 'text.primary',
                  }}
                >
                  Sign Out
                </Button>
              )}
            </Box>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={toggleDarkMode} sx={{ mr: 1 }}>
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 300,
            bgcolor: darkMode ? '#121212' : '#FFFFFF',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              textDecoration: 'none',
            }}
            onClick={handleDrawerToggle}
          >
            Burlington<span style={{ color: theme.palette.primary.main }}>Deals</span>
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.text}
              component={RouterLink}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                py: 1.5,
                borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
              }}
            >
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          ))}
          
          {/* Admin Links - Only show if user is admin */}
          {isAdmin && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography 
                variant="subtitle2" 
                sx={{ pl: 2, py: 1, color: theme.palette.primary.main, fontWeight: 'bold' }}
              >
                Admin Controls
              </Typography>
              
              {adminItems.map((item) => (
                <ListItemButton
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  onClick={handleDrawerToggle}
                  sx={{
                    py: 1.5,
                    borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                  }}
                >
                  <Box sx={{ mr: 2, color: theme.palette.primary.main }}>
                    {item.icon}
                  </Box>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItemButton>
              ))}
              <Divider sx={{ my: 1 }} />
            </>
          )}
          
          {/* Add About and Contact to mobile menu */}
          <ListItemButton
            component={RouterLink}
            to="/about"
            onClick={handleDrawerToggle}
            sx={{
              py: 1.5,
              borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
            }}
          >
            <ListItemText primary="About" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItemButton>
          
          <ListItemButton
            component={RouterLink}
            to="/contact-us"
            onClick={handleDrawerToggle}
            sx={{
              py: 1.5,
              borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
            }}
          >
            <ListItemText primary="Contact" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItemButton>
          
          {/* Login/Logout in mobile menu */}
          <ListItemButton
            component={RouterLink}
            to={auth.token ? '/' : '/login'}
            onClick={() => {
              if (auth.token) logout();
              handleDrawerToggle();
            }}
            sx={{
              py: 1.5,
              mt: 2,
              bgcolor: theme.palette.primary.main,
              color: '#FFFFFF',
              borderRadius: 1,
              mx: 2,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            <ListItemText 
              primary={auth.token ? "Sign Out" : "Sign In"} 
              primaryTypographyProps={{ 
                fontWeight: 600, 
                textAlign: 'center' 
              }} 
            />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
};

export default Header;