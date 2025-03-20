// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const dealRoutes = require('./routes/dealRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { authenticateToken, authorizeAdmin } = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000; // Fallback to 5000 for local development

// Configure CORS
app.use(cors({
  origin: 'https://burlingtondeals.ca', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Basic test route
app.get('/api', (req, res) => {
  res.send('Hello from the Burlington Deals API!');
});

// Auth routes
app.use('/api/auth', authRoutes);

// Deal routes
app.use('/api/deals', dealRoutes);

// Restaurant routes
app.use('/api/restaurants', restaurantRoutes);

// Admin routes
app.use('/api/admin', authenticateToken, authorizeAdmin, adminRoutes);

// Contact routes
app.use('/api/contact', contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
