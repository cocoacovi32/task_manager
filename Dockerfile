FROM python:3.10-slim

# Set environment variables for Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install system dependencies (needed for some Python packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .

# Set the working directory to where manage.py lives
# Using quotes to handle the space in your folder name
WORKDIR "/app/task_manager backend/collab_task_manager/backend"

# Collect static files
RUN python manage.py collectstatic --noinput

# Create a clean startup script
RUN mkdir -p /app/scripts && printf '#!/bin/sh\n\
python manage.py migrate --noinput\n\
# Create test user if it doesn't exist\n\
python manage.py shell << PYEOF\n\
from django.contrib.auth.models import User\n\
if not User.objects.filter(username="testuser").exists():\n\
    User.objects.create_user(username="testuser", password="testpass123")\n\
    print("Test user created!")\n\
PYEOF\n\
\n\
PORT=${PORT:-8000}\n\
exec gunicorn task_manager.wsgi --bind 0.0.0.0:$PORT --workers 4 --timeout 120\n\
' > /app/scripts/start.sh

RUN chmod +x /app/scripts/start.sh

# Railway uses the PORT env variable automatically
EXPOSE 8000

CMD ["/bin/sh", "/app/scripts/start.sh"]