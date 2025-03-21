#!/bin/bash

echo "🚀 Starting Burlington Deals development environment..."

# Start backend in the background
echo "🔧 Starting API server..."
cd burlington-deals-api
npm run dev &
BACKEND_PID=$!

# Start frontend
echo "🖥️ Starting React frontend..."
cd ../burlington-deals-frontend
npm start

# When frontend is stopped, also stop the backend
kill $BACKEND_PID
echo "👋 Development environment stopped."
