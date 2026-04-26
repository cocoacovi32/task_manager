#!/bin/bash
set -e

echo "Starting local production environment..."

# Build backend
cd "task_manager backend/collab_task_manager/backend"
docker build -t task-manager-backend:latest .
cd ../../..

# Build frontend
cd frontend
docker build -t task-manager-frontend:latest --build-arg REACT_APP_API_URL=http://localhost:8000 .
cd ..

# Start services
docker run -d \
  --name task-manager-db \
  -e POSTGRES_DB=task_manager \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

echo "Waiting for database to be ready..."
sleep 5

docker run -d \
  --name task-manager-backend \
  -e DEBUG=False \
  -e SECRET_KEY=django-insecure-local-production-key \
  -e ALLOWED_HOSTS=localhost,127.0.0.1,backend \
  -e DATABASE_URL=postgresql://postgres:postgres@task-manager-db:5432/task_manager \
  -e DB_ENGINE=django.db.backends.postgresql \
  -e DB_NAME=task_manager \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  -e DB_HOST=task-manager-db \
  -e DB_PORT=5432 \
  -e CORS_ALLOWED_ORIGINS=http://localhost,http://127.0.0.1 \
  -p 8000:8000 \
  --link task-manager-db:task-manager-db \
  task-manager-backend:latest

echo "Waiting for backend to be ready..."
sleep 5

docker run -d \
  --name task-manager-frontend \
  -p 3000:80 \
  --link task-manager-backend:backend \
  task-manager-frontend:latest

echo ""
echo "========================================="
echo "Local Production Environment is Running!"
echo "========================================="
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:8000"
echo "Database:  localhost:5432"
echo "Admin:     http://localhost:8000/admin"
echo ""
echo "Database credentials:"
echo "  User:     postgres"
echo "  Password: postgres"
echo ""
echo "To stop all services, run:"
echo "  docker stop task-manager-db task-manager-backend task-manager-frontend"
echo "  docker rm task-manager-db task-manager-backend task-manager-frontend"
echo ""
