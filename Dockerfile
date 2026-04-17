# This tells Railway to build the Backend
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .

# Set PYTHONPATH and change to backend directory for gunicorn
WORKDIR /app/task_manager\ backend/collab_task_manager/backend

# Collect static files
RUN python manage.py collectstatic --noinput || true

# Run migrations on startup
RUN mkdir -p /app/scripts
RUN echo '#!/bin/sh\npython manage.py migrate --noinput\ngunicorn task_manager.wsgi --bind 0.0.0.0:8000' > /app/scripts/start.sh
RUN chmod +x /app/scripts/start.sh

# Expose port
EXPOSE 8000

# Start the server
CMD ["/app/scripts/start.sh"]
