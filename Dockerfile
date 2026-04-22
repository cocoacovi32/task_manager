FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .

# Navigate to the actual Django project directory
WORKDIR /app/task_manager\ backend/collab_task_manager/backend

# Collect static files
RUN python manage.py collectstatic --noinput

# Create startup script with proper path handling and PORT support
RUN mkdir -p /app/scripts && cat > /app/scripts/start.sh << 'EOF'
#!/bin/sh
set -e
cd /app/task_manager\ backend/collab_task_manager/backend
python manage.py migrate --noinput

# Create test user if it doesn't exist
python manage.py shell << PYEOF
from django.contrib.auth.models import User
if not User.objects.filter(username='testuser').exists():
    User.objects.create_user(username='testuser', password='testpass123')
    print("Test user created!")
PYEOF

PORT=${PORT:-8000}
exec gunicorn task_manager.wsgi --bind 0.0.0.0:$PORT --workers 4 --timeout 120
EOF
RUN chmod +x /app/scripts/start.sh

EXPOSE 8000

CMD ["/bin/sh", "/app/scripts/start.sh"]
