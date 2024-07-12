-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  mfa_secret VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optionally, insert an initial user (replace with secure values)
-- INSERT INTO users (username, password, mfa_secret) VALUES ('admin', 'hashed_password', 'mfa_secret');
