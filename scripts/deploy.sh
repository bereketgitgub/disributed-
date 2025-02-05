#!/bin/bash

echo "Starting deployment process..."

# Check if MySQL is running
if ! mysqladmin ping -h localhost -u root --silent; then
    echo "❌ MySQL is not running. Please start MySQL first."
    exit 1
fi

# Create database and tables
echo "Setting up database..."
mysql -u root < database/schema.sql
mysql -u root library_management < database/add_admin.sql
mysql -u root library_management < database/sample_data.sql

# Install backend dependencies
echo "Installing backend dependencies..."
cd library-backend
npm install
npm audit fix

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../library-frontend
npm install
npm audit fix

# Build frontend
echo "Building frontend..."
npm run build

# Start services
echo "Starting services..."
cd ../library-backend
pm2 delete library-backend 2>/dev/null || true
pm2 start server.js --name library-backend

echo "✅ Deployment complete!" 