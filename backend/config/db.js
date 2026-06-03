const { Pool } = require('pg');

// Use DATABASE_URL from .env or fallback
let connectionString = process.env.DATABASE_URL;
if (connectionString && connectionString.includes('?')) {
  // Remove query parameters like sslmode=require that override custom ssl configurations in node-postgres
  connectionString = connectionString.split('?')[0];
}

const isLocalhost = connectionString && (
  connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
);

const pool = new Pool({
  connectionString: connectionString,
  ssl: isLocalhost ? false : { rejectUnauthorized: false }
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
      is_breaking BOOLEAN DEFAULT FALSE,
      is_trending BOOLEAN DEFAULT FALSE,
      is_video BOOLEAN DEFAULT FALSE,
      views VARCHAR(50) DEFAULT '0',
      upload_time VARCHAR(100),
      upload_time_ta VARCHAR(100),
      created_at TIMESTAMPTZ,
      expires_at TIMESTAMPTZ,
      updated_at TIMESTAMPTZ
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
