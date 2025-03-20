// src/pages/ContactUsPage.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { Formik, Form } from 'formik';
import ReCAPTCHA from 'react-google-recaptcha';
import * as Yup from 'yup';
import API from '../services/api';

/**
 * Example reCAPTCHA site key
 *  - get your own key from https://www.google.com/recaptcha/admin
 */
const RECAPTCHA_SITE_KEY = 'yourReCAPTCHA_site_key_here';

const ContactUsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // We track success/error after submission
  const [submissionStatus, setSubmissionStatus] = useState({
    success: '',
    error: '',
  });

  // Formik + Yup validation
  const ContactSchema = Yup.object().shape({
    name: Yup.string()
      .max(100, 'Name cannot exceed 100 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .max(100, 'Email cannot exceed 100 characters')
      .required('Email is required'),
    message: Yup.string()
      .max(1000, 'Message cannot exceed 1000 characters')
      .required('Message is required'),
    reason: Yup.string()
      .required('Please select a reason'),
    // These next two are only required if reason === 'business'
    businessName: Yup.string()
      .max(200, 'Business name cannot exceed 200 characters')
      .when('reason', {
        is: 'business',
        then: (schema) => schema.required('Business Name is required for Business Inquiry'),
        otherwise: (schema) => schema.notRequired(),
      }),
    phone: Yup.string()
      .max(50, 'Phone cannot exceed 50 characters')
      .when('reason', {
        is: 'business',
        then: (schema) => schema.required('Phone is required for Business Inquiry'),
        otherwise: (schema) => schema.notRequired(),
      }),
  });

  const initialValues = {
    name: '',
    email: '',
    message: '',
    reason: '',         // "feedback" or "business"
    businessName: '',
    phone: '',
    recaptchaToken: '',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmissionStatus({ success: '', error: '' });

    try {
      // POST to /api/contact
      const response = await API.post('/contact', {
        name: values.name,
        email: values.email,
        message: values.message,
        reason: values.reason,
        businessName: values.businessName,
        phone: values.phone,
        // recaptchaToken: values.recaptchaToken, (optional if you want to verify on server)
      });
      setSubmissionStatus({ success: response.data.message, error: '' });
      resetForm();
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || 'Something went wrong. Please try again.';
      setSubmissionStatus({ success: '', error: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          maxWidth: 700,
          width: '100%',
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph align="center">
          We’d love to hear from you! Whether you’re a user with feedback or a 
          local business looking to partner with us, let’s connect.
        </Typography>

        {submissionStatus.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submissionStatus.error}
          </Alert>
        )}
        {submissionStatus.success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {submissionStatus.success}
          </Alert>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={ContactSchema}
          onSubmit={handleSubmit}
        >
          {({
            errors,
            touched,
            isSubmitting,
            handleChange,
            handleBlur,
            values,
            setFieldValue,
          }) => (
            <Form>
              {/* Name */}
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                variant="outlined"
                sx={{ mb: 2 }}
              />

              {/* Email */}
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                variant="outlined"
                sx={{ mb: 2 }}
              />

              {/* Reason (feedback or business) */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="reason-label">Reason</InputLabel>
                <Select
                  labelId="reason-label"
                  id="reason"
                  name="reason"
                  label="Reason"
                  value={values.reason}
                  onChange={handleChange}
                  error={touched.reason && Boolean(errors.reason)}
                >
                  <MenuItem value="feedback">General Feedback / Feature Request</MenuItem>
                  <MenuItem value="business">Business / Promotional Inquiry</MenuItem>
                </Select>
                {touched.reason && errors.reason && (
                  <Typography variant="caption" color="error">
                    {errors.reason}
                  </Typography>
                )}
              </FormControl>

              {/* If reason=business, show business name + phone */}
              {values.reason === 'business' && (
                <>
                  <TextField
                    fullWidth
                    label="Business Name"
                    name="businessName"
                    value={values.businessName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.businessName && Boolean(errors.businessName)}
                    helperText={touched.businessName && errors.businessName}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </>
              )}

              {/* Message / Comments */}
              <TextField
                fullWidth
                label="Message"
                name="message"
                multiline
                rows={6}
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.message && Boolean(errors.message)}
                helperText={touched.message && errors.message}
                variant="outlined"
                sx={{ mb: 2 }}
              />

              {/* reCAPTCHA */}
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={(token) => setFieldValue('recaptchaToken', token)}
                />
              </Box>

              {/* Submit Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size="1rem" color="inherit" />
                    ) : null
                  }
                  sx={{ px: 4, py: 1, fontSize: '1rem' }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>

        {/* Additional marketing text to encourage business partnerships */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Ready to Promote Your Business?
          </Typography>
          <Typography variant="body2" paragraph>
            Our platform reaches hundreds (soon thousands!) of local deal seekers every day. 
            Let us help you showcase your exclusive specials and promotions. Fill out the 
            form above, select <strong>Business / Promotional Inquiry</strong>, and we’ll 
            contact you about partnership opportunities.
          </Typography>
          <Typography variant="body2">
            Whether you’re a new restaurant looking for exposure or an established venue 
            wanting to highlight a special event, we have flexible plans to help you 
            reach more customers and grow your brand.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ContactUsPage;
