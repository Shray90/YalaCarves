# 🪵 Yala Carves - Complete E-commerce Website

![Yala Carves](https://img.shields.io/badge/Yala%20Carves-E--commerce-brown)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![React](https://img.shields.io/badge/React-Frontend-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Admin Panel](https://img.shields.io/badge/Admin-Panel-orange)

**Complete full-stack e-commerce solution for traditional Nepali wood carvings with PostgreSQL database, admin panel, and comprehensive inventory management.**

## ✨ Features

### 🛒 **Customer Experience**
- ✅ User Registration & Authentication
- ✅ Product Browsing with Categories & Search
- ✅ Shopping Cart & Wishlist
- ✅ Order Placement & Tracking
- ✅ User Profile Management
- ✅ Responsive Design (Mobile/Desktop)

### 🛡️ **Admin Panel**
- ✅ **Dashboard** - Sales analytics & overview
- ✅ **Product Management** - Add, edit, delete products
- ✅ **Inventory Control** - Real-time stock tracking
- ✅ **Order Management** - Process & track orders
- ✅ **User Management** - Customer information
- ✅ **Low Stock Alerts** - Automatic notifications
- ✅ **Sales Reports** - Revenue analytics

### 🗄️ **Database & Backend**
- ✅ **PostgreSQL** - Robust database design
- ✅ **JWT Authentication** - Secure user sessions
- ✅ **RESTful API** - Complete backend API
- ✅ **Real-time Updates** - Live inventory tracking
- ✅ **Data Validation** - Input sanitization
- ✅ **Error Handling** - Comprehensive error management

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v12+)
- npm or yarn

### 1️⃣ **Automated Installation**
```bash
# Clone and run installation script
./install.sh
```

### 2️⃣ **Manual Setup**

#### Database Setup
```bash
# Create PostgreSQL database
sudo -u postgres createdb yala_carves
```

#### Backend Setup
```bash
cd backend
npm install
npm run init-db  # Initialize database with sample data
npm run dev      # Start backend server
```

#### Frontend Setup
```bash
npm install
npm run dev      # Start frontend development server
```

## 🔑 **Admin Access**

**Default Admin Credentials:**
- **Email:** admin@yalacarves.com
- **Password:** admin123

**Admin Panel:** http://localhost:5173/admin/dashboard

## 📱 **Application URLs**

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Admin Panel:** http://localhost:5173/admin/dashboard
- **API Health:** http://localhost:5000/api/health

## 🏗️ **Tech Stack**

### Frontend
- **React 18** - Modern UI framework
- **React Router 6** - Client-side routing
- **TailwindCSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Context API** - State management

### Backend
- **Node.js & Express** - Server framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### DevOps
- **Vite** - Fast development server
- **PostgreSQL** - Production database
- **CORS** - Cross-origin support
- **Helmet** - Security headers

## 📊 **Database Schema**

### Core Tables
- **users** - User accounts (customers & admins)
- **products** - Product catalog with inventory
- **categories** - Product categorization
- **orders** - Complete order management
- **cart_items** - Persistent shopping cart
- **inventory_logs** - Stock change tracking

### Sample Data Included
- ✅ 12 Traditional products
- ✅ 5 Product categories
- ✅ Default admin account
- ✅ Sample inventory data

## 🎯 **API Endpoints**

### Authentication
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
GET  /api/auth/profile      # Get profile
```

### Products
```
GET  /api/products          # List products (with filters)
GET  /api/products/:id      # Product details
POST /api/products          # Create product (admin)
PUT  /api/products/:id      # Update product (admin)
```

### Orders
```
POST /api/orders            # Create order
GET  /api/orders/my-orders  # User orders
GET  /api/orders/admin/all  # All orders (admin)
```

### Admin
```
GET  /api/admin/dashboard/stats     # Dashboard analytics
GET  /api/admin/users               # User management
POST /api/admin/inventory/bulk-update # Bulk stock update
```

## 🎨 **Admin Panel Features**

### Dashboard
- **Overview Statistics** - Products, orders, revenue, users
- **Low Stock Alerts** - Automatic inventory warnings
- **Recent Orders** - Latest customer orders
- **Top Products** - Best selling items
- **Monthly Revenue** - Sales analytics

### Product Management
- **Add Products** - Create new items with categories
- **Edit Products** - Update details, pricing, stock
- **Inventory Control** - Real-time stock management
- **Category Management** - Organize product categories

### Order Processing
- **Order Queue** - Pending orders requiring attention
- **Status Updates** - Progress tracking (pending → confirmed → shipped → delivered)
- **Payment Status** - Track payment confirmation
- **Customer Details** - Complete order information

## 🛡️ **Security Features**

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcrypt encryption
- ✅ **Rate Limiting** - API request throttling
- ✅ **Input Validation** - Comprehensive data validation
- ✅ **CORS Protection** - Cross-origin security
- ✅ **Admin Guards** - Role-based access control

## 🌟 **Product Categories**

1. **Religious Art** - Sacred sculptures and artifacts
2. **Architectural** - Traditional building elements
3. **Spiritual** - Meditation and practice items
4. **Cultural** - Traditional Nepali artifacts
5. **Home Decor** - Decorative pieces

## 📈 **Inventory Management**

- **Real-time Stock Tracking** - Live inventory updates
- **Low Stock Alerts** - Automatic notifications when stock < 5
- **Inventory Logs** - Complete audit trail of stock changes
- **Bulk Updates** - Mass inventory adjustments
- **Stock Reservations** - Automatic reservation during checkout

## 🎭 **Sample Products Included**

- Traditional Ganesh Sculpture (Rs 35,000)
- Nepali Window Panel (Rs 58,000)
- Buddha Meditation Statue (Rs 24,000)
- Traditional Mask Collection (Rs 18,000)
- Lotus Flower Carving (Rs 15,000)
- Temple Guardian Lion (Rs 47,000)
- *...and 6 more authentic pieces*

## 🚢 **Production Deployment**

### Database
- Use managed PostgreSQL (AWS RDS, Google Cloud SQL)
- Configure connection pooling
- Set up automated backups

### Backend
- Deploy to Railway, Heroku, or DigitalOcean
- Set environment variables
- Configure SSL and domain

### Frontend
- Build: `npm run build`
- Deploy to Vercel or Netlify
- Update API URL for production

## 📞 **Support & Troubleshooting**

### Common Issues
1. **Database Connection** - Check PostgreSQL is running
2. **Environment Variables** - Verify .env files are configured
3. **Port Conflicts** - Ensure ports 5000 and 5173 are available
4. **Admin Access** - Use default credentials: admin@yalacarves.com / admin123

### Debug Commands
```bash
# Check backend health
curl http://localhost:5000/api/health

# Check database connection
npm run init-db

# View backend logs
cd backend && npm run dev
```

## 📄 **License**

Built for Yala Carves - Traditional Nepali Wood Carvings

---

## 🎉 **Ready to Launch!**

Your complete e-commerce website is ready with:
- ✅ Customer-facing store
- ✅ Admin management panel  
- ✅ PostgreSQL database
- ✅ Inventory management
- ✅ Order processing
- ✅ User authentication
- ✅ Real-time analytics

**Start selling beautiful Nepali wood carvings today!** 🪵✨

---

*For detailed setup instructions, see [SETUP.md](SETUP.md)*
