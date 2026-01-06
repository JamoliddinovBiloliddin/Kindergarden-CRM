-- Kindergarten CRM Database Schema
-- PostgreSQL Database Structure

-- Users Table (for authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'director', 'teacher', 'parent')),
    password_hash VARCHAR(255), -- For future password support
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Children Table
CREATE TABLE children (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    group_name VARCHAR(100),
    parent_id INTEGER REFERENCES users(id),
    qr_code VARCHAR(100) UNIQUE NOT NULL,
    parent_code VARCHAR(50) REFERENCES users(code),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meals Table
CREATE TABLE meals (
    id SERIAL PRIMARY KEY,
    child_id INTEGER REFERENCES children(id),
    child_name VARCHAR(255),
    meal_type VARCHAR(50) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'snack')),
    menu TEXT,
    meal_time TIME,
    meal_date DATE NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vaccination Table
CREATE TABLE vaccinations (
    id SERIAL PRIMARY KEY,
    child_id INTEGER REFERENCES children(id),
    child_name VARCHAR(255),
    vaccine_name VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    completed_date DATE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activities Table
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    activity_date DATE NOT NULL,
    activity_time TIME,
    group_name VARCHAR(100),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food Storage Table (Director Only)
CREATE TABLE food_storage (
    id SERIAL PRIMARY KEY,
    food_item VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    min_amount DECIMAL(10, 2) NOT NULL,
    last_updated_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sleep Tracking Table
CREATE TABLE sleep_records (
    id SERIAL PRIMARY KEY,
    child_id INTEGER REFERENCES children(id),
    child_name VARCHAR(255),
    sleep_date DATE NOT NULL,
    sleep_start TIME NOT NULL,
    wake_up TIME,
    duration INTEGER, -- in minutes
    recorded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Homework Table
CREATE TABLE homework (
    id SERIAL PRIMARY KEY,
    child_id INTEGER REFERENCES children(id),
    child_name VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_date DATE NOT NULL,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'not_done' CHECK (status IN ('done', 'not_done')),
    assigned_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance Table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    child_id INTEGER REFERENCES children(id),
    attendance_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    check_in_time TIME,
    check_out_time TIME,
    recorded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(child_id, attendance_date)
);

-- Complaints & Suggestions Table
CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES users(id),
    parent_code VARCHAR(50),
    parent_name VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
    response TEXT,
    responded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings Table (User Preferences)
CREATE TABLE user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) UNIQUE,
    theme VARCHAR(50) DEFAULT 'blue',
    language VARCHAR(10) DEFAULT 'uz',
    dark_mode BOOLEAN DEFAULT FALSE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_meals_child_date ON meals(child_id, meal_date);
CREATE INDEX idx_vaccinations_child ON vaccinations(child_id);
CREATE INDEX idx_attendance_child_date ON attendance(child_id, attendance_date);
CREATE INDEX idx_sleep_child_date ON sleep_records(child_id, sleep_date);
CREATE INDEX idx_homework_child ON homework(child_id);
CREATE INDEX idx_complaints_parent ON complaints(parent_id);

-- Sample Data Insertion (for testing)
INSERT INTO users (code, name, email, role) VALUES
('ADMIN001', 'Admin User', 'admin@kindergarten.com', 'admin'),
('DIR001', 'Director User', 'director@kindergarten.com', 'director'),
('TEACH001', 'Teacher User', 'teacher@kindergarten.com', 'teacher'),
('PARENT001', 'Parent User', 'parent@kindergarten.com', 'parent');

INSERT INTO children (name, age, group_name, parent_code, qr_code) VALUES
('Ali Valiyev', 4, 'A guruhi', 'PARENT001', 'CHILD001'),
('Sardor Karimov', 5, 'B guruhi', 'PARENT002', 'CHILD002');

