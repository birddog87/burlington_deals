// src/App.js
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, CircularProgress } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import CookieConsentBanner from './components/CookieConsentBanner';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ScrollToTop from './components/ScrollToTop';
import AdminDashboard from './pages/AdminDashboard';

// Lazy-loaded components
const DealsPage = lazy(() => import('./pages/DealsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const AddDealPage = lazy(() => import('./pages/AddDealPage'));
const AdminDealsPage = lazy(() => import('./pages/AdminDealsPage'));
const AdminUserPage = lazy(() => import('./pages/AdminUserPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const RestaurantsPage = lazy(() => import('./pages/RestaurantsPage'));

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ScrollToTop /> 
        <Header />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
          }}
        >
          <Suspense
            fallback={
              <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
              </Box>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/all-deals" element={<DealsPage />} />
              <Route path="/restaurants" element={<RestaurantsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact-us" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />

              {/* Protected Routes */}
              <Route
                path="/submit-deal"
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
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
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