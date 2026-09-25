#!/usr/bin/env bash
# SnakeSafe - Full-Stack Emergency Response System Launcher (macOS/Linux)
echo "======================================================================"
echo "          SnakeSafe - Snake Bite Emergency Response System"
echo "     From Bite to Treatment -- Faster, Safer, Smarter"
echo "======================================================================"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[1/3] Starting Python FastAPI AI Identification Service (Port 8000)..."
(cd "$ROOT_DIR/ai-service" && python3 -m uvicorn main:app --host 127.0.0.1 --port 8000) &
PID_AI=$!

sleep 2

echo "[2/3] Starting Spring Boot Backend API (Port 8080)..."
(cd "$ROOT_DIR/backend" && mvn spring-boot:run) &
PID_BACKEND=$!

sleep 3

echo "[3/3] Starting React Vite Frontend (Port 5173)..."
(cd "$ROOT_DIR/frontend" && npm run dev) &
PID_FRONTEND=$!

echo "All services started!"
echo "Open: http://localhost:5173"

trap "kill $PID_AI $PID_BACKEND $PID_FRONTEND" EXIT
wait
