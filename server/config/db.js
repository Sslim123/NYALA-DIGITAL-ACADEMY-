require('dotenv').config();
console.log("DATABASE_URL is:", process.env.DATABASE_URL); // ← add this
const { Pool } = require('pg');
const pool = new Pool({
  
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL connected")
})

pool.on("error", err => {
  console.error("PostgreSQL error:", err)
})

module.exports = pool;