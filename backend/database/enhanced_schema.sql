-- Enhanced Yala Carves Database Schema
-- Additional tables for security questions and contact messages

-- Add security questions to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS security_question VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS security_answer VARCHAR(255);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread', -- unread, read, replied
    admin_reply TEXT,
    replied_by INTEGER REFERENCES users(id),
    replied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User addresses enhancement (for profile management)
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS label VARCHAR(100); -- Home, Work, etc.
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Product stock logs enhancement
CREATE TABLE IF NOT EXISTS stock_adjustments (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    adjustment_type VARCHAR(50) NOT NULL, -- restock, damage, return, manual
    quantity_change INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    cost_per_unit DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    supplier VARCHAR(255),
    notes TEXT,
    adjusted_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User activity logs
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_stock_adjustments_product ON stock_adjustments(product_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user ON user_activity_logs(user_id);

-- Insert sample contact messages for testing
INSERT INTO contact_messages (name, email, phone, subject, message) VALUES
('Ram Sharma', 'ram@example.com', '+977-9841234567', 'Product Inquiry', 'I am interested in the Traditional Ganesh Sculpture. Could you provide more details about the wood type and shipping?'),
('Sita Rai', 'sita@example.com', '+977-9851234567', 'Custom Order', 'I would like to place a custom order for a Buddha statue. Can you create something similar to your meditation statue but in a larger size?'),
('John Smith', 'john@example.com', NULL, 'Shipping Question', 'Do you ship internationally? I am interested in purchasing several items from the US.');

-- Update sample users with security questions
UPDATE users SET 
    security_question = 'What was the name of your first pet?',
    security_answer = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' -- "fluffy"
WHERE email = 'admin@yalacarves.com';
