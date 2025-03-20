// src/App.js

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme, CircularProgress } from '@mui/material';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AddDealPage from './pages/AddDealPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDealsPage from './pages/AdminDealsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage'; // import
import ResetPasswordPage from './pages/ResetPasswordPage';   // import
import LoginPage from './pages/LoginPage';
import CookieConsentBanner from './components/CookieConsentBanner'; // Import the banner
import PrivacyPolicy from './pages/PrivacyPolicy'; // Import the Privacy Policy page
import TermsAndConditions from './pages/TermsAndConditions'; // Assuming you've created this
import Footer from './components/Footer'; // We'll create this next
import ContactUsPage from './pages/ContactUsPage'; // Import the Contact Us Page
import RegisterPage from './pages/RegisterPage';
// Lazy load AdminUserPage
const AdminUserPage = lazy(() => import('./pages/AdminUserPage'));
// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#6B46C1',
      light: '#A78BFA',
      dark: '#4C3D63',
      contrastText: '#fff',
    },
    secondary: {
      main: '#F9A825',
      light: '#FAD6A5',
      dark: '#C07500',
      contrastText: '#000',
    },
    background: {
      default: '#F9FAFB',
      paper: '#fff',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
    action: {
      active: '#6B46C1',
      hover: 'rgba(107, 70, 193, 0.08)',
    },
  },
  typography: {
    fontFamily: '"Outfit", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
        },
        containedPrimary: {
          backgroundColor: '#6B46C1',
          '&:hover': {
            backgroundColor: '#5A39A5',
          },
        },
        containedSecondary: {
          backgroundColor: '#F9A825',
          color: '#000',
          '&:hover': {
            backgroundColor: '#E09710',
          },
        },
        outlinedPrimary: {
          borderColor: '#6B46C1',
          color: '#6B46C1',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          color: '#1E293B',
          boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '64px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiFormControl: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPagination-ul': {
            justifyContent: 'center',
          },
        },
        outlined: {
          borderColor: '#e0e0e0',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: '100%',
            maxWidth: '1400px',
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2, sm: 3 },
            mt: 2,
          }}
        >
          <Suspense
            fallback={
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/contact-us" element={<ContactUsPage />} />

              {/* Protected Routes */}
              <Route
                path="/add-deal"
                element={
                  <ProtectedRoute>
                    <AddDealPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/deals"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDealsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminUserPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Box>
        <Footer />
        <CookieConsentBanner />
      </Box>
    </ThemeProvider>
  );
}

export default App;