#!/bin/bash

echo "🎯 Setting up Yala Carves E-commerce Website..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v18 or higher.${NC}"
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed. Please install PostgreSQL first.${NC}"
    echo "Visit: https://www.postgresql.org/download/"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Install frontend dependencies
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
npm install

# Install backend dependencies
echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd backend
npm install

# Create environment files if they don't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚙️ Creating backend environment file...${NC}"
    cp .env.example .env
    echo "Please edit backend/.env with your database credentials"
fi

cd ..

if [ ! -f .env ]; then
    echo -e "${YELLOW}⚙️ Creating frontend environment file...${NC}"
    echo "VITE_API_URL=http://localhost:5000/api" > .env
fi

echo ""
echo -e "${GREEN}🎉 Installation completed!${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. 🗄️  Set up PostgreSQL database:"
echo "   sudo -u postgres createdb yala_carves"
echo ""
echo "2. ⚙️  Edit backend/.env with your database credentials"
echo ""
echo "3. 🚀 Initialize database and start backend:"
echo "   cd backend"
echo "   npm run init-db"
echo "   npm run dev"
echo ""
echo "4. 🎨 In another terminal, start frontend:"
echo "   npm run dev"
echo ""
echo -e "${GREEN}🔑 Default Admin Credentials:${NC}"
echo "   Email: admin@yalacarves.com"
echo "   Password: admin123"
echo ""
echo -e "${BLUE}📍 URLs:${NC}"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo "   Admin:    http://localhost:5173/admin/dashboard"
echo ""
echo -e "${GREEN}✨ Happy coding!${NC}"
