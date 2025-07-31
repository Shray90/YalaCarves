# 🔥 Yala Carves - Enhanced E-commerce System

## 🎯 **Complete Feature List**

Your enhanced e-commerce system now includes ALL requested features:

### 🛡️ **Admin Panel Features**
- ✅ **Product Stocking Management** - Add, edit, delete products with inventory control
- ✅ **User Management** - View customer accounts and activity
- ✅ **Inventory Management** - Real-time stock tracking with low stock alerts
- ✅ **Contact Messages Management** - View and reply to customer inquiries
- ✅ **Dashboard Analytics** - Sales overview, top products, revenue tracking
- ✅ **Order Management** - Process orders from pending to delivered

### 👤 **User Profile Features**
- ✅ **Edit Personal Data** - Update name, phone, and account information
- ✅ **Address Management** - Add, edit, delete shipping/billing addresses
- ✅ **Order History** - Complete order tracking and status updates
- ✅ **Security Settings** - Change password with current password verification

### 🔐 **Enhanced Authentication**
- ✅ **Security Questions** - Set during signup for password recovery
- ✅ **Password Reset Flow** - Email → Security Question → New Password
- ✅ **Activity Logging** - Track login attempts and account changes
- ✅ **JWT Authentication** - Secure token-based authentication

### 📧 **Contact System**
- ✅ **Contact Form** - Customers can send inquiries
- ✅ **Admin Message Management** - View, reply, and track message status
- ✅ **Message Statistics** - Unread, read, replied counts
- ✅ **Reply System** - Admin can respond directly to customer messages

## 🚀 **Quick Start Guide**

### 1. **Database Setup** (PostgreSQL Required)
```bash
# Create database
sudo -u postgres createdb yala_carves

# Start PostgreSQL service
sudo service postgresql start
```

### 2. **Backend Setup**
```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Initialize database with enhanced features
npm run init-db

# Start backend server
npm run dev
```

### 3. **Frontend Setup**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔑 **Admin Access**

**Default Admin Credentials:**
- **Email:** admin@yalacarves.com
- **Password:** admin123
- **Security Question:** "What was the name of your first pet?"
- **Security Answer:** fluffy

**Admin Panel URL:** http://localhost:5173/admin/dashboard

## 📊 **New API Endpoints**

### Authentication & Security
```
POST /api/auth/register           # Enhanced signup with security questions
POST /api/auth/forgot-password    # Start password reset process
POST /api/auth/verify-security-answer  # Verify security answer
POST /api/auth/reset-password     # Reset password with token
GET  /api/auth/security-questions # Get available security questions
```

### Contact Management
```
POST /api/contact/submit          # Submit contact form (public)
GET  /api/contact/admin/messages  # Get all messages (admin)
GET  /api/contact/admin/messages/:id  # Get message details (admin)
POST /api/contact/admin/messages/:id/reply  # Reply to message (admin)
PUT  /api/contact/admin/messages/:id/status # Update message status (admin)
GET  /api/contact/admin/stats     # Get contact statistics (admin)
```

### Address Management
```
GET  /api/addresses               # Get user addresses
POST /api/addresses               # Create new address
PUT  /api/addresses/:id           # Update address
DELETE /api/addresses/:id         # Delete address
PUT  /api/addresses/:id/set-default  # Set default address
```

## 🎨 **New Features in Detail**

### **1. Enhanced User Registration**
- Security question selection during signup
- Password strength validation
- Account verification system

### **2. Password Reset System**
- Email-based password reset initiation
- Security question verification
- Secure token-based password reset
- 30-minute token expiration

### **3. User Profile Management**
- **Personal Information Tab:**
  - Edit name, phone number
  - View account creation date
  - Email address (read-only)

- **Address Management Tab:**
  - Add multiple shipping/billing addresses
  - Set default addresses per type
  - Label addresses (Home, Office, etc.)
  - Edit and delete addresses

- **Order History Tab:**
  - View all past orders
  - Order status tracking
  - Payment status information
  - Order details and item counts

- **Security Tab:**
  - Change password (with current password verification)
  - Account security information
  - Password strength requirements

### **4. Admin Contact Management**
- **Message Dashboard:**
  - View all customer messages
  - Filter by status (unread, read, replied)
  - Search through messages
  - Statistics overview

- **Message Details:**
  - Full customer information
  - Complete message content
  - Reply directly to customers
  - Track reply history

- **Status Management:**
  - Mark messages as read/unread
  - Track replied messages
  - Admin reply attribution

### **5. Enhanced Contact Form**
- **Customer Fields:**
  - Name, email (required)
  - Phone number (optional)
  - Subject line (optional)
  - Detailed message (required)

- **Form Features:**
  - Real-time validation
  - Success confirmation
  - Error handling
  - Professional layout

## 📱 **Admin Panel Navigation**

Your admin panel now includes:
- **Dashboard** - Overview and analytics
- **Products** - Product management and inventory
- **Orders** - Order processing and fulfillment
- **Users** - Customer account management
- **Messages** - Contact form management *(NEW)*
- **Analytics** - Sales and performance data
- **Settings** - System configuration

## 🔧 **Database Schema Updates**

New tables added:
- **contact_messages** - Customer inquiries and admin replies
- **password_reset_tokens** - Secure password reset tokens
- **user_activity_logs** - Track user actions and login attempts
- **stock_adjustments** - Enhanced inventory tracking

Enhanced tables:
- **users** - Added security questions and answers
- **addresses** - Added labels and phone numbers

## 🛡️ **Security Features**

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure authentication tokens
- **Rate Limiting** - API request throttling
- **Input Validation** - Comprehensive data validation
- **SQL Injection Protection** - Parameterized queries
- **CORS Security** - Cross-origin request protection
- **Activity Logging** - Track user actions for security

## 📧 **Contact Form Flow**

1. **Customer submits contact form** on /contact page
2. **Message saved to database** with "unread" status
3. **Admin receives notification** in admin panel
4. **Admin can view message details** and customer information
5. **Admin replies directly** through admin interface
6. **Message status updated** to "replied"
7. **Reply tracked** with admin attribution and timestamp

## 💡 **Usage Examples**

### **For Customers:**
1. **Browse products** → Add to cart → Checkout
2. **Create account** with security question setup
3. **Manage profile** → Edit personal info and addresses
4. **Contact support** → Submit inquiry through contact form
5. **Track orders** → View order history and status

### **For Admin:**
1. **Manage inventory** → Add products, update stock levels
2. **Process orders** → Update order status, track fulfillment
3. **Handle inquiries** → Reply to customer messages
4. **Monitor performance** → View dashboard analytics
5. **Manage users** → View customer accounts and activity

## 🎯 **What's Different from Before**

### **Enhanced Authentication:**
- Security questions during signup
- Forgot password functionality
- Account security improvements

### **Complete Profile Management:**
- Edit personal information
- Multiple address management
- Order history tracking
- Password change functionality

### **Admin Contact System:**
- Customer message management
- Reply system with tracking
- Message status workflow
- Contact form integration

### **Improved User Experience:**
- Better form validation
- Success/error messaging
- Responsive design improvements
- Professional contact system

## 🚀 **Production Deployment**

All features are production-ready with:
- Environment variable configuration
- Database migration scripts
- Error handling and logging
- Security best practices
- Scalable architecture

Your complete e-commerce system is now ready with ALL requested features! 🎉

**Test the system:**
1. Register a new account with security question
2. Try the password reset flow
3. Manage your profile and addresses
4. Submit a contact form
5. Login as admin to manage everything

**Everything you requested is now fully functional!** ✨
