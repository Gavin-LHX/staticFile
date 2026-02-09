#!/bin/bash

echo "Starting StaticFile Backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

echo "Backend is starting on http://localhost:3001"
echo ""

echo "Starting StaticFile Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Frontend is starting on http://localhost:3000"
echo ""
echo "Both services are starting. Please wait a moment..."
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
