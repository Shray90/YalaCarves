-- Yala Carves E-commerce Database Schema
-- Create database: CREATE DATABASE yala_carves;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    category_id INTEGER REFERENCES categories(id),
    artisan VARCHAR(255),
    image_url VARCHAR(500),
    emoji VARCHAR(10),
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Addresses table
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) DEFAULT 'shipping', -- shipping, billing
    street_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Nepal',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
    payment_method VARCHAR(50), -- cash_on_delivery, bank_transfer, etc.
    shipping_address_id INTEGER REFERENCES addresses(id),
    billing_address_id INTEGER REFERENCES addresses(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL, -- price at time of order
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cart table (for persistent cart)
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Wishlist table
CREATE TABLE wishlist_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Inventory logs table (for tracking stock changes)
CREATE TABLE inventory_logs (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    change_type VARCHAR(50) NOT NULL, -- add, remove, sold, returned
    quantity_change INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reason TEXT,
    changed_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin activity logs
CREATE TABLE admin_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50), -- product, order, user, etc.
    entity_id INTEGER,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_wishlist_user ON wishlist_items(user_id);

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
('Religious Art', 'religious', 'Sacred sculptures and religious artifacts'),
('Architectural', 'architectural', 'Traditional Nepali architectural elements'),
('Spiritual', 'spiritual', 'Items for meditation and spiritual practice'),
('Cultural', 'cultural', 'Traditional Nepali cultural artifacts'),
('Home Decor', 'decorative', 'Decorative items for home and office');

-- Insert default admin user
-- Password: admin123 (hashed with bcryptjs)
INSERT INTO users (name, email, password, is_admin) VALUES
('Admin', 'admin@yalacarves.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);

-- Insert sample products
INSERT INTO products (name, slug, description, price, original_price, category_id, artisan, emoji, stock_quantity) VALUES
('Traditional Ganesh Sculpture', 'traditional-ganesh-sculpture', 'Beautifully hand-carved Ganesh statue crafted from premium teak wood. This traditional piece features intricate details and represents the remover of obstacles in Hindu tradition.', 35000.00, 42000.00, 1, 'Master Bijay Shakya', '🐘', 8),
('Nepali Window Panel', 'nepali-window-panel', 'Authentic Newari-style wooden window panel featuring traditional geometric patterns and floral motifs. Hand-carved using centuries-old techniques.', 58000.00, 71000.00, 2, 'Master Sanu Kaji Shakya', '🪟', 3),
('Buddha Meditation Statue', 'buddha-meditation-statue', 'Serene Buddha statue in meditation pose, carved from sustainable sal wood. Features peaceful expression and traditional robes detail.', 24000.00, 29000.00, 3, 'Master Raju Nakarmi', '🧘', 15),
('Traditional Mask Collection', 'traditional-mask-collection', 'Set of three traditional Nepali masks representing different deities and cultural characters. Hand-painted with natural pigments.', 18000.00, 22000.00, 4, 'Master Ganga Kaji', '🎭', 12),
('Lotus Flower Carving', 'lotus-flower-carving', 'Elegant lotus flower wall hanging carved from sustainably sourced hardwood. Symbol of purity and enlightenment.', 15000.00, 19000.00, 5, 'Master Indra Pradhan', '🪷', 20),
('Temple Guardian Lion', 'temple-guardian-lion', 'Majestic guardian lion sculpture traditionally placed at temple entrances. Features fierce expression and intricate mane details.', 47000.00, 54000.00, 1, 'Master Binod Chitrakar', '🦁', 5),
('Peacock Wall Art', 'peacock-wall-art', 'Stunning peacock relief carving showcasing the national bird of Nepal. Features detailed feather work and traditional motifs.', 21000.00, 26000.00, 5, 'Master Dinesh Prajapati', '🦚', 9),
('Himalayan Yak Sculpture', 'himalayan-yak-sculpture', 'Authentic yak sculpture representing the hardy animals of the Himalayas. Carved with attention to anatomical details.', 29000.00, 36000.00, 4, 'Master Pemba Sherpa', '🐂', 0),
('Traditional Prayer Wheel', 'traditional-prayer-wheel', 'Handcrafted wooden prayer wheel with traditional mantras inscribed. Spins smoothly and includes authentic Tibetan prayers.', 11000.00, 15000.00, 3, 'Master Tenzin Norbu', '☸️', 25),
('Newari Door Panel', 'newari-door-panel', 'Exquisite Newari-style door panel featuring traditional woodcarving techniques passed down through generations.', 71000.00, 86000.00, 2, 'Master Ratna Shakya', '🚪', 2),
('Wooden Incense Holder', 'wooden-incense-holder', 'Beautifully carved wooden incense holder with traditional motifs. Features multiple stick holders and ash collection base.', 5000.00, 7000.00, 3, 'Master Hari Shrestha', '🔥', 45),
('Dancing Shiva Sculpture', 'dancing-shiva-sculpture', 'Dynamic Nataraja (Dancing Shiva) sculpture capturing the cosmic dance of creation and destruction. Intricate details in every limb.', 43000.00, 50000.00, 1, 'Master Krishna Chitrakar', '🕺', 6);
