#!/bin/bash
# Lens Attendance System - Local Dev Launcher
# Usage: ./start.sh

set -e

echo "🎯 Starting Lens Attendance System..."
echo ""

# Kill any existing processes on our ports
lsof -ti:3000 -ti:8000 | xargs kill -9 2>/dev/null || true

# Start Backend
echo "📦 Starting Backend (port 8000)..."
cd backend
if [ -d "venv" ]; then
  ./venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8000 &
elif [ -d "../venv" ]; then
  ../venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8000 &
else
  python3 -m uvicorn main:app --host 127.0.0.1 --port 8000 &
fi
BACKEND_PID=$!
cd ..

# Wait for backend
sleep 2

# Start Frontend
echo "🎨 Starting Frontend (port 3000)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Lens Attendance System Running!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:8000"
echo "  API Docs:  http://localhost:8000/docs"
echo ""
echo "  Press Ctrl+C to stop all services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM
wait
