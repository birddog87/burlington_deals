// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * POST /api/contact
 * Handle both general feedback and business inquiries
 */
router.post('/', async (req, res) => {
  const { name, email, message, reason, businessName, phone } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
    // 1) Insert into a "contact" or "inquiries" table in your DB, if you want to store them.
    const insertQuery = `
      INSERT INTO contacts (name, email, message, reason, business_name, phone, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING contact_id;
    `;
    const values = [name, email, message, reason, businessName, phone];
    const result = await pool.query(insertQuery, values);

    // 2) Send an email to you so you know you got a new inquiry
    // Make sure you set EMAIL_USER, EMAIL_PASS in .env
    // e.g. EMAIL_USER=contact@burlingtondeals.ca, EMAIL_PASS=yourGmailOrSMTPpassword
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Compose the email
    const mailOptions = {
      from: process.env.EMAIL_USER, // who is sending
      to: 'contact@burlingtondeals.ca', // your receiving email
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
