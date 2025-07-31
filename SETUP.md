# Yala Carves E-commerce Setup Guide

## 🎯 Complete Full-Stack E-commerce Website with Admin Panel

This is a complete e-commerce solution for **Yala Carves** - a traditional Nepali wood carving store with PostgreSQL database, admin panel, and full inventory management.

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## 🗄️ Database Setup

### 1. Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (with Homebrew)
brew install postgresql

# Windows - Download from https://www.postgresql.org/download/
```

### 2. Create Database
```bash
# Start PostgreSQL service
sudo service postgresql start  # Linux
brew services start postgresql  # macOS

# Access PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE yala_carves;
CREATE USER yala_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE yala_carves TO yala_user;
\q
```

## 🚀 Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your database credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yala_carves
DB_USER=yala_user
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key
```

### 3. Initialize Database
```bash
# Run database initialization script
npm run init-db
```

This will:
- Create all necessary tables
- Insert sample categories and products
- Create default admin user

### 4. Start Backend Server
```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
# From project root
npm install
```

### 2. Configure Environment
```bash
# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 3. Start Frontend
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 🔑 Default Admin Access

**Default Admin Credentials:**
- **Email:** `admin@yalacarves.com`
- **Password:** `admin123`

**Admin Panel URL:** `http://localhost:5173/admin/dashboard`

## 🌟 Features

### 👤 User Features
- ✅ User Registration & Login
- ✅ Product Browsing & Search
- ✅ Shopping Cart Management
- ✅ Order Placement & Tracking
- ✅ User Profile Management
- ✅ Wishlist Functionality

### 🛡️ Admin Features
- ✅ **Dashboard** - Analytics & Overview
- ✅ **Product Management** - Add, Edit, Delete Products
- ✅ **Inventory Management** - Stock Control & Tracking
- ✅ **Order Management** - View & Update Order Status
- ✅ **User Management** - View Customer Information
- ✅ **Real-time Stock Updates**
- ✅ **Low Stock Alerts**
- ✅ **Sales Analytics**

### 🛒 E-commerce Features
- ✅ **Product Categories** - Religious, Architectural, Spiritual, Cultural, Decorative
- ✅ **Inventory Tracking** - Real-time stock management
- ✅ **Order Processing** - Complete order lifecycle
- ✅ **Payment Integration Ready** - Cash on Delivery, Bank Transfer
- ✅ **Address Management** - Shipping & Billing addresses
- ✅ **Order History** - Complete order tracking

## 📊 Database Schema

The system includes these main tables:
- **users** - Customer and admin accounts
- **products** - Product catalog with inventory
- **categories** - Product categorization
- **orders** - Order management
- **order_items** - Order line items
- **cart_items** - Shopping cart persistence
- **addresses** - Customer addresses
- **inventory_logs** - Stock change tracking

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - User's orders
- `GET /api/orders/admin/all` - All orders (Admin)

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard analytics
- `GET /api/admin/users` - User management
- `POST /api/admin/inventory/bulk-update` - Bulk stock update

## 🎨 Admin Panel Screenshots

### Dashboard
- Overview statistics (products, orders, revenue)
- Low stock alerts
- Recent orders
- Top selling products

### Product Management
- Add new products with categories
- Edit existing products
- Manage inventory levels
- Upload product images (emoji system)

### Order Management
- View all orders
- Update order status (pending → confirmed → shipped → delivered)
- Update payment status
- Customer information

## 🔧 Customization

### Adding New Product Categories
1. Access admin panel
2. Go to Categories section
3. Add new category with name and description

### Managing Inventory
1. Go to Products section in admin
2. Edit product to update stock
3. Use bulk update for multiple products
4. Monitor inventory logs

### Order Processing Workflow
1. Customer places order
2. Admin receives notification
3. Admin confirms order
4. Admin updates to shipped
5. Admin marks as delivered

## 🚀 Production Deployment

### Database
- Use managed PostgreSQL (AWS RDS, Google Cloud SQL)
- Set up proper backup strategy
- Configure connection pooling

### Backend
- Deploy to cloud platform (Heroku, Railway, DigitalOcean)
- Set environment variables
- Configure domain and SSL

### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or static hosting
- Update API URL in environment

## 🛡️ Security Features

- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Rate Limiting
- ✅ CORS Protection
- ✅ Input Validation
- ✅ SQL Injection Prevention
- ✅ Admin Role Protection

## 📞 Support

For any issues or questions:
1. Check the console logs for errors
2. Verify database connection
3. Ensure all environment variables are set
4. Check API endpoint responses

## 📄 License

This is a complete e-commerce solution built for Yala Carves traditional Nepali wood carving business.

---

**🎉 Your complete e-commerce website with admin panel is ready!**

**Quick Start:**
1. Set up PostgreSQL database
2. Run `npm run init-db` in backend folder
3. Start backend: `npm run dev`
4. Start frontend: `npm run dev`
5. Access admin panel with default credentials
6. Start adding your products!
