-- -- PostgreSQL Database Schema for Ticket Booking Platform
-- -- This file contains all the necessary tables and relationships

-- -- Enable UUID extension for generating unique IDs
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -- Users table for authentication and user management
-- CREATE TABLE users (
--     id SERIAL PRIMARY KEY,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     first_name VARCHAR(100) NOT NULL,
--     last_name VARCHAR(100) NOT NULL,
--     gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')) NOT NULL,
--     is_active BOOLEAN DEFAULT true,
--     role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Trips table for bus routes and schedules
-- CREATE TABLE trips (
--     id SERIAL PRIMARY KEY,
--     bus_id VARCHAR(50) NOT NULL,
--     bus_name VARCHAR(100) NOT NULL,
--     bus_number VARCHAR(20) NOT NULL,
--     operator VARCHAR(100) NOT NULL,
--     from_city VARCHAR(100) NOT NULL,
--     to_city VARCHAR(100) NOT NULL,
--     departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
--     arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
--     duration INTEGER NOT NULL, -- in minutes
--     distance DECIMAL(8,2) NOT NULL, -- in kilometers
--     base_price DECIMAL(10,2) NOT NULL,
--     total_seats INTEGER NOT NULL,
--     available_seats INTEGER NOT NULL,
--     bus_type VARCHAR(50) NOT NULL, -- AC, Non-AC, Sleeper, Semi-Sleeper, etc.
--     amenities JSONB DEFAULT '[]'::jsonb, -- Array of amenities
--     is_active BOOLEAN DEFAULT true,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Bookings table for ticket reservations and payments
-- CREATE TABLE bookings (
--     id SERIAL PRIMARY KEY,
--     booking_id VARCHAR(50) UNIQUE NOT NULL, -- Human-readable booking ID
--     user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--     trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
--     passenger_name VARCHAR(100) NOT NULL,
--     passenger_email VARCHAR(255) NOT NULL,
--     passenger_phone VARCHAR(20) NOT NULL,
--     passenger_age INTEGER NOT NULL,
--     passenger_gender VARCHAR(10) CHECK (passenger_gender IN ('male', 'female', 'other')) NOT NULL,
--     seat_numbers JSONB NOT NULL, -- Array of seat numbers
--     total_amount DECIMAL(10,2) NOT NULL,
--     payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
--     payment_method VARCHAR(50) CHECK (payment_method IN ('credit_card', 'debit_card', 'upi', 'net_banking', 'wallet')),
--     payment_id VARCHAR(100), -- External payment gateway ID
--     booking_status VARCHAR(20) DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
--     booking_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     travel_date DATE NOT NULL,
--     cancellation_reason TEXT,
--     refund_amount DECIMAL(10,2) DEFAULT 0,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create indexes for better performance
-- CREATE INDEX idx_users_email ON users(email);
-- CREATE INDEX idx_users_phone ON users(phone);
-- CREATE INDEX idx_users_role ON users(role);
-- CREATE INDEX idx_users_is_active ON users(is_active);

-- CREATE INDEX idx_trips_from_city ON trips(from_city);
-- CREATE INDEX idx_trips_to_city ON trips(to_city);
-- CREATE INDEX idx_trips_departure_time ON trips(departure_time);
-- CREATE INDEX idx_trips_bus_type ON trips(bus_type);
-- CREATE INDEX idx_trips_is_active ON trips(is_active);
-- CREATE INDEX idx_trips_route ON trips(from_city, to_city);

-- CREATE INDEX idx_bookings_user_id ON bookings(user_id);
-- CREATE INDEX idx_bookings_trip_id ON bookings(trip_id);
-- CREATE INDEX idx_bookings_booking_id ON bookings(booking_id);
-- CREATE INDEX idx_bookings_booking_status ON bookings(booking_status);
-- CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
-- CREATE INDEX idx_bookings_travel_date ON bookings(travel_date);
-- CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);

-- -- Create function to update updated_at timestamp
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- -- Create triggers to automatically update updated_at
-- CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
--     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
--     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
--     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -- Insert sample data for testing
-- INSERT INTO users (email, password, first_name, last_name, gender, role) VALUES
-- ('admin@ticketbooking.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/9KzKz2W', 'Admin', 'User', 'male', 'admin'),
-- ('user@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/9KzKz2W', 'John', 'Doe', 'male', 'user');

-- -- Insert sample trips
-- INSERT INTO trips (bus_id, bus_name, bus_number, operator, from_city, to_city, departure_time, arrival_time, duration, distance, base_price, total_seats, available_seats, bus_type, amenities) VALUES
-- ('BUS001', 'Luxury Express', 'LE-001', 'RedBus Travels', 'New York', 'Boston', '2024-01-15 08:00:00+00', '2024-01-15 12:00:00+00', 240, 215.5, 45.00, 50, 50, 'AC', '["WiFi", "Charging Port", "Blanket", "Water Bottle"]'),
-- ('BUS002', 'City Connect', 'CC-002', 'City Bus Lines', 'Boston', 'New York', '2024-01-15 14:00:00+00', '2024-01-15 18:30:00+00', 270, 215.5, 35.00, 40, 40, 'Non-AC', '["Charging Port"]'),
-- ('BUS003', 'Sleeper Plus', 'SP-003', 'Comfort Travels', 'Los Angeles', 'San Francisco', '2024-01-16 22:00:00+00', '2024-01-17 06:00:00+00', 480, 380.0, 65.00, 30, 30, 'Sleeper', '["WiFi", "Blanket", "Pillow", "Water Bottle", "Snacks"]'),
-- ('BUS004', 'Express Line', 'EL-004', 'Fast Track Buses', 'Chicago', 'Detroit', '2024-01-16 09:30:00+00', '2024-01-16 15:45:00+00', 375, 280.0, 42.50, 45, 45, 'Semi-Sleeper', '["WiFi", "Charging Port", "Blanket"]');

-- -- Create a view for trip details with booking counts
-- CREATE VIEW trip_details AS
-- SELECT 
--     t.*,
--     COUNT(b.id) as total_bookings,
--     COUNT(CASE WHEN b.booking_status = 'confirmed' THEN 1 END) as confirmed_bookings
-- FROM trips t
-- LEFT JOIN bookings b ON t.id = b.trip_id
-- GROUP BY t.id;

-- -- Create a view for user booking history
-- CREATE VIEW user_booking_history AS
-- SELECT 
--     b.*,
--     t.bus_name,
--     t.bus_number,
--     t.from_city,
--     t.to_city,
--     t.departure_time,
--     t.arrival_time,
--     u.first_name,
--     u.last_name
-- FROM bookings b
-- JOIN trips t ON b.trip_id = t.id
-- JOIN users u ON b.user_id = u.id;

-- -- Grant necessary permissions (adjust as needed for your setup)
-- -- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- -- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
