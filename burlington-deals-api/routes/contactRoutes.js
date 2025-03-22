// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const sgMail = require('@sendgrid/mail');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Rate limiter: 5 requests per hour per IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per window
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Verify reCAPTCHA token with Google
 */
async function verifyRecaptcha(token) {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    // Use axios to post to the verification endpoint
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: secretKey,
          response: token
        }
      }
    );
    
    console.log('reCAPTCHA response:', response.data); // Log the response for debugging
    
    // Check if the verification was successful
    if (response.data.success) {
      return true;
    } else {
      console.error('reCAPTCHA verification failed:', response.data['error-codes']);
      return false;
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}



/**
 * POST /api/contact
 * Handle both general feedback and business inquiries
 */
router.post('/', contactLimiter, async (req, res) => {
  const { name, email, message, reason, businessName, phone, recaptchaToken, honeypot } = req.body;

  // Check honeypot - if it's filled, it's likely a bot
  if (honeypot) {
    // Silently reject with a 200
    return res.status(200).json({
      message: 'Thank you for contacting us! We will get back to you soon.',
    });
  }

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  // Verify reCAPTCHA
  if (recaptchaToken) {
    try {
      const isValidCaptcha = await verifyRecaptcha(recaptchaToken);
      if (!isValidCaptcha) {
        return res.status(400).json({ error: 'reCAPTCHA validation failed. Please try again.' });
      }
    } catch (captchaError) {
      console.error('reCAPTCHA verification error:', captchaError);
      // Continue processing even if reCAPTCHA verification fails
    }
  }

  try {
    // 1) Insert into contacts table
    const insertQuery = `
      INSERT INTO contacts (name, email, message, reason, business_name, phone, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING contact_id;
    `;
    const values = [name, email, message, reason, businessName || null, phone || null];
    const result = await pool.query(insertQuery, values);
    
    // Return success immediately after database insert
    res.status(200).json({
      message: 'Thank you for contacting us! We will get back to you soon.',
      contact_id: result.rows[0].contact_id,
    });

    // 2) Try to send email notification using SendGrid
    try {
      const msg = {
        to: process.env.SENDGRID_TO_EMAIL || 'contact@burlingtondeals.ca',
        from: process.env.SENDGRID_FROM_EMAIL, // Must be verified sender
        subject: 'New Contact Form Submission - Burlington Deals',
        text: `
You have a new inquiry from your contact form:

Name: ${name}
Email: ${email}
Reason: ${reason || 'Not specified'}
Business Name: ${businessName || 'N/A'}
Phone: ${phone || 'N/A'}

Message:
${message}

Submitted At: ${new Date().toLocaleString()}
        `,
        html: `
<h2>New Contact Form Submission</h2>
<p>You have received a new inquiry from the Burlington Deals contact form:</p>
<table border="0" cellpadding="5">
  <tr><td><strong>Name:</strong></td><td>${name}</td></tr>
  <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
  <tr><td><strong>Reason:</strong></td><td>${reason || 'Not specified'}</td></tr>
  <tr><td><strong>Business Name:</strong></td><td>${businessName || 'N/A'}</td></tr>
  <tr><td><strong>Phone:</strong></td><td>${phone || 'N/A'}</td></tr>
</table>
<h3>Message:</h3>
<p>${message.replace(/\n/g, '<br>')}</p>
<p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
        `,
      };

      await sgMail.send(msg);
      console.log('SendGrid email sent successfully');
    } catch (emailErr) {
      console.error('SendGrid email error:', emailErr);
    }
  } catch (err) {
    console.error('Error handling contact form submission:', err);
    // Only send error response if we haven't already sent a success response
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
});

module.exports = router;