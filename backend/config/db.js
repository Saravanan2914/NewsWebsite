const { Pool } = require('pg');

// Use DATABASE_URL from .env or fallback to a dummy connection string during development if not provided
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost') ? false : {
    rejectUnauthorized: false
  }
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Function to initialize the database schema
async function initDb() {
  if (!process.env.DATABASE_URL) {
    console.warn("WARNING: DATABASE_URL is not set. PostgreSQL will not work correctly without a connection string.");
    return;
  }
  
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS news (
      id SERIAL PRIMARY KEY,
      title TEXT,
      title_ta TEXT,
      description TEXT,
      description_ta TEXT,
      content TEXT,
      content_ta TEXT,
      image_data TEXT,
      image_mimetype VARCHAR(50),
      category VARCHAR(100),
      created_at TIMESTAMP,
      expires_at TIMESTAMP,
      updated_at TIMESTAMP
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log("PostgreSQL database initialized successfully.");
  } catch (error) {
    console.error("Error initializing PostgreSQL database schema:", error);
  }
}

module.exports = { pool, initDb };
