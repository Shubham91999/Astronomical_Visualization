#!/bin/bash

# Function to kill background processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

trap cleanup SIGINT

echo "Starting Astronomical Visualization Dashboard..."

# Start Backend
echo "Starting Backend..."
cd server
source venv/bin/activate
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "Starting Frontend..."
cd client
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Dashboard running!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
