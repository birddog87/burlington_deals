// scripts/importData.js
const fs = require('fs');
const csv = require('csv-parser');
const pool = require('../config/db'); // Ensure this path is correct

// Map to store master_business_id to restaurant_id
const masterIdToRestaurantId = new Map();

// 1) Import Businesses
async function importBusinesses() {
  return new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream('../data/businesses.csv') // Update path if necessary
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', async () => {
        try {
          for (const b of rows) {
            const masterBusinessId = b.master_business_id || b.master_id || null; // Adjust based on CSV
            if (!masterBusinessId) {
              console.error('Missing master_business_id for a restaurant. Skipping.');
              continue;
            }

            const name = b.name || 'Unknown Name';
            const business_status = b.business_status || 'OPERATIONAL';
            const address = b.formatted_address || null;
            const city = b.city || 'Burlington';
            const website = b.website || null;
            const geometry_location_lat = parseFloat(b.geometry_location_lat) || null;
            const geometry_location_lng = parseFloat(b.geometry_location_lng) || null;
            const geometry_viewport_northeast_lat = parseFloat(b.geometry_viewport_northeast_lat) || null;
            const geometry_viewport_northeast_lng = parseFloat(b.geometry_viewport_northeast_lng) || null;
            const geometry_viewport_southwest_lat = parseFloat(b.geometry_viewport_southwest_lat) || null;
            const geometry_viewport_southwest_lng = parseFloat(b.geometry_viewport_southwest_lng) || null;
            const opening_hours_open_now = b.opening_hours_open_now === 'TRUE';
            const place_id = b.place_id || null;
            const plus_code_compound_code = b.plus_code_compound_code || null;
            const plus_code_global_code = b.plus_code_global_code || null;
            const price_level = parseInt(b.price_level) || null;
            const rating = parseFloat(b.rating) || null;
            const reference = b.reference || null;
            const types = b.types || null;
            const user_ratings_total = parseInt(b.user_ratings_total) || null;
            const normalized_name = b.normalized_name || null;

            // Insert into restaurants
            const insertQuery = `
              INSERT INTO restaurants
                (master_business_id, name, business_status, address, city, website,
                geometry_location_lat, geometry_location_lng, 
                geometry_viewport_northeast_lat, geometry_viewport_northeast_lng,
                geometry_viewport_southwest_lat, geometry_viewport_southwest_lng,
                opening_hours_open_now, place_id, plus_code_compound_code, 
                plus_code_global_code, price_level, rating, reference, types, 
                user_ratings_total, normalized_name, is_active)
              VALUES
                ($1, $2, $3, $4, $5, $6, 
                $7, $8, 
                $9, $10, 
                $11, $12, 
                $13, $14, $15, 
                $16, $17, $18, $19, $20, 
                $21, $22, true)
              ON CONFLICT (master_business_id) DO NOTHING
              RETURNING restaurant_id;
            `;
            const values = [
              masterBusinessId, name, business_status, address, city, website,
              geometry_location_lat, geometry_location_lng,
              geometry_viewport_northeast_lat, geometry_viewport_northeast_lng,
              geometry_viewport_southwest_lat, geometry_viewport_southwest_lng,
              opening_hours_open_now, place_id, plus_code_compound_code,
              plus_code_global_code, price_level, rating, reference, types,
              user_ratings_total, normalized_name
            ];

            const result = await pool.query(insertQuery, values);
            if (result.rows.length > 0) {
              const newId = result.rows[0].restaurant_id;
              masterIdToRestaurantId.set(masterBusinessId, newId);
              console.log(`Inserted restaurant: ${name} with ID ${newId}`);
            } else {
              // If restaurant already exists, fetch its ID
              const fetchResult = await pool.query(
                'SELECT restaurant_id FROM restaurants WHERE master_business_id = $1',
                [masterBusinessId]
              );
              if (fetchResult.rows.length > 0) {
                masterIdToRestaurantId.set(masterBusinessId, fetchResult.rows[0].restaurant_id);
                console.log(`Restaurant already exists: ${name} with ID ${fetchResult.rows[0].restaurant_id}`);
              }
            }
          }

          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on('error', reject);
  });
}

// 2) Import Deals
async function importDeals() {
  return new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream('../data/deals.csv') // Update path if necessary
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', async () => {
        try {
          for (const d of rows) {
            const masterId = d.master_id || d.master_business_id || null; // From deals CSV
            if (!masterId) {
              console.error('Missing master_id for a deal. Skipping.');
              continue;
            }

            const restaurantId = masterIdToRestaurantId.get(masterId);
            if (!restaurantId) {
              console.error(`No matching restaurant for master_id = ${masterId}; skipping deal.`);
              continue;
            }

            const title = d.name_match_validation ? `Deal ${d.deal_id}` : d.details || 'No Title'; // Adjust based on your CSV
            const description = d.description || '';
            const details = d.details || '';
            const price = d.price || '';
            const day = d.day || '';
            const category = d.category || '';
            const second_category = d.second_category || '';
            const start_time = d.start_time || null; // e.g., "16:00:00"
            const end_time = d.end_time || null; // e.g., "22:00:00"

            // Insert into deals
            const insertDealQuery = `
              INSERT INTO deals
                (restaurant_id, title, description, price, day_of_week, category,
                 second_category, start_time, end_time, is_approved, created_by)
              VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, false, NULL)
            `;
            const values = [
              restaurantId,
              title,
              description,
              price,
              day,
              category,
              second_category,
              start_time,
              end_time
            ];

            await pool.query(insertDealQuery, values);
            console.log(`Inserted deal for restaurant ID ${restaurantId}: ${title}`);
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on('error', reject);
  });
}

// 3) Master Function to Run Imports
async function runImport() {
  try {
    console.log('Starting import process...');

    console.log('Importing businesses...');
    await importBusinesses();
    console.log('Finished importing businesses.');

    console.log('Importing deals...');
    await importDeals();
    console.log('Finished importing deals.');
  } catch (err) {
    console.error('Error during import:', err);
  } finally {
    pool.end(); // Close DB connection
    console.log('Import process completed.');
  }
}

runImport();
