#!/bin/bash

# Start backend
cd backend
npm run dev &

# Start frontend
cd ../library-frontend
npm run dev &

echo "Development servers started!" 