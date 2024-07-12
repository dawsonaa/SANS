const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createUser = async (username, hashedPassword, mfaSecret) => {
  const query = 'INSERT INTO users (username, password, mfa_secret) VALUES ($1, $2, $3)';
  await pool.query(query, [username, hashedPassword, mfaSecret]);
};

const getUserByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = $1';
  const res = await pool.query(query, [username]);
  return res.rows[0];
};

module.exports = { createUser, getUserByUsername };
