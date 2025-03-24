// src/pages/ContactPage.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Container,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import API from '../services/api';
import ReCAPTCHA from 'react-google-recaptcha';

// reCAPTCHA site key
const RECAPTCHA_SITE_KEY = '6LeS_fsqAAAAADjsSMtdU-S3_va72C_BlQWK936R';

const ContactPage = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: '',
    businessName: '',
    phone: '',
    message: '',
    recaptchaToken: '',
    honeypot: '' // Honeypot field for bots
  });
  
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Track when form was first loaded (for timing check)
  const [formLoadTime] = useState(Date.now());
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Check if form was submitted too quickly (less than 2 seconds)
    const submissionTime = Date.now();
    const timeElapsed = submissionTime - formLoadTime;
    if (timeElapsed < 2000) { // 2 seconds in milliseconds
      setSnackbar({
        open: true,
        message: 'Form submitted too quickly. Please take your time to fill it out properly.',
        severity: 'error'
      });
      setLoading(false);
      return;
    }

    // Check if recaptcha is completed
    if (!formData.recaptchaToken) {
      setSnackbar({
        open: true,
        message: 'Please complete the reCAPTCHA verification',
        severity: 'error'
      });
      setLoading(false);
      return;
    }
    
    try {
      await API.post('/contact', formData);
      
      setSnackbar({
        open: true,
        message: 'Your message has been sent successfully! We\'ll get back to you soon.',
        severity: 'success'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        reason: '',
        businessName: '',
        phone: '',
        message: '',
        recaptchaToken: '',
        honeypot: ''
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'There was an error sending your message. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" align="center" gutterBottom>
          Contact Us
        </Typography>
        
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}>
          Have questions about Burlington Deals? Want to submit a restaurant or report an issue? 
          We're here to help! Fill out the form below and we'll get back to you as soon as possible.
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Send Us a Message
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      select
                      label="Reason for Contact"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                    >
                      <MenuItem value="feedback">General Feedback / Feature Request</MenuItem>
                      <MenuItem value="restaurant">Restaurant Submission</MenuItem>
                      <MenuItem value="report">Report an Issue</MenuItem>
                      <MenuItem value="business">Business Partnership</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </TextField>
                  </Grid>
                  
                  {formData.reason === 'restaurant' || formData.reason === 'business' ? (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Business Name"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleChange}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </Grid>
                    </>
                  ) : null}
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Your Message"
                      name="message"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  {/* Honeypot field - hidden from humans but visible to bots */}
                  <TextField
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={handleChange}
                    sx={{
                      opacity: 0,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: 0,
                      width: 0,
                      zIndex: -1,
                    }}
                    aria-hidden="true"
                    tabIndex="-1"
                  />
                  
                  {/* reCAPTCHA */}
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                      <ReCAPTCHA
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={(token) => {
                          setFormData(prev => ({ ...prev, recaptchaToken: token }));
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={loading}
                      sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Contact Information
              </Typography>
              
              <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <LocationOnIcon sx={{ color: theme.palette.primary.main, mr: 2, fontSize: 28 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Our Location
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Burlington, Ontario, Canada
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <EmailIcon sx={{ color: theme.palette.primary.main, mr: 2, fontSize: 28 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Email Us
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      contact@burlingtondeals.ca
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <PhoneIcon sx={{ color: theme.palette.primary.main, mr: 2, fontSize: 28 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Call Us
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      (123) 456-7890
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ mt: 6 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Business Hours
                </Typography>
                
                <Typography variant="body2" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 5:00 PM</span>
                </Typography>
                
                <Typography variant="body2" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Saturday:</span>
                  <span>10:00 AM - 2:00 PM</span>
                </Typography>
                
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Sunday:</span>
                  <span>Closed</span>
                </Typography>
              </Box>
              
              <Box sx={{ mt: 6 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Ready to Promote Your Business?
                </Typography>
                <Typography variant="body2">
                  Our platform reaches hundreds of local deal seekers every day. 
                  Select <strong>Business Partnership</strong> in the form to learn about 
                  our promotional opportunities.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactPage;