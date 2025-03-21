// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const nodemailer = require('nodemailer');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

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
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
    );
    return response.data.success;
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
    // Silently reject with a 200 to prevent bot from knowing it's been detected
    return res.status(200).json({
      message: 'Thank you for contacting us! We will get back to you soon.',
    });
  }

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  // Verify reCAPTCHA
  if (!recaptchaToken) {
    return res.status(400).json({ error: 'reCAPTCHA verification is required.' });
  }

  try {
    // Verify with Google
    const isValidCaptcha = await verifyRecaptcha(recaptchaToken);
    if (!isValidCaptcha) {
      return res.status(400).json({ error: 'reCAPTCHA validation failed. Please try again.' });
    }

    // 1) Insert into contacts table
    const insertQuery = `
      INSERT INTO contacts (name, email, message, reason, business_name, phone, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING contact_id;
    `;
    const values = [name, email, message, reason, businessName, phone];
    const result = await pool.query(insertQuery, values);

    // 2) Send email notification
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Compose the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'contact@burlingtondeals.ca', // Your receiving email
      subject: 'New Contact / Inquiry',
      text: `
        You have a new inquiry from your contact form:

        Name: ${name}
        Email: ${email}
        Reason: ${reason}
        Business Name: ${businessName || 'N/A'}
        Phone: ${phone || 'N/A'}

        Message:
        ${message}

        Submitted At: ${new Date().toLocaleString()}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Thank you for contacting us! We will get back to you soon.',
      contact_id: result.rows[0].contact_id,
    });
  } catch (err) {
    console.error('Error handling contact form submission:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;