// config/db.js

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Heroku sets this environment variable
  ssl: {
    rejectUnauthorized: false, // Required for Heroku PostgreSQL
  },
});

module.exports = pool;
