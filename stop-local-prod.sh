#!/bin/bash

echo "Stopping and removing all task manager containers..."
docker stop task-manager-db task-manager-backend task-manager-frontend 2>/dev/null
docker rm task-manager-db task-manager-backend task-manager-frontend 2>/dev/null
docker network rm app-network 2>/dev/null

echo "Cleanup complete. To restart the services, run:"
echo "  docker network create app-network"
echo "  docker run -d --name task-manager-db --network app-network -e POSTGRES_DB=task_manager -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15-alpine"
echo "  docker run -d --name task-manager-backend --network app-network -e DEBUG=False -e DB_HOST=task-manager-db -p 8000:8000 task-manager-backend:latest"
echo "  docker run -d --name task-manager-frontend --network app-network -p 3000:80 task-manager-frontend:latest"
