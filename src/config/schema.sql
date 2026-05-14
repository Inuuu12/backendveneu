-- users
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role ENUM('admin', 'owner', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- venues
CREATE TABLE IF NOT EXISTS venues (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  thumbnail VARCHAR(255),
  description TEXT,
  latitude DOUBLE,
  longitude DOUBLE,
  availability BOOLEAN DEFAULT 1,
  category VARCHAR(100),
  owner_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- venue images
CREATE TABLE IF NOT EXISTS venue_images (
  id VARCHAR(36) PRIMARY KEY,
  venue_id VARCHAR(36),
  image_url VARCHAR(255),
  FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
);

-- venue categories
CREATE TABLE IF NOT EXISTS venue_categories (
  id VARCHAR(36) PRIMARY KEY,
  venue_id VARCHAR(36),
  category VARCHAR(100),
  FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
);

-- bookings
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(36) PRIMARY KEY,
  venue_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_hours INT NOT NULL,
  note TEXT,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- venue ratings
CREATE TABLE IF NOT EXISTS venue_ratings (
  id VARCHAR(36) PRIMARY KEY,
  venue_id VARCHAR(36),
  user_id VARCHAR(36),
  rating INT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- venue fees
CREATE TABLE IF NOT EXISTS venue_fees (
  id VARCHAR(36) PRIMARY KEY,
  venue_id VARCHAR(36),
  name VARCHAR(100),
  amount DECIMAL(10,2),
  type ENUM('fixed', 'per_day'),
  FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
);
