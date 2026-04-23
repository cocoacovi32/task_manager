#!/bin/bash
python manage.py migrate --noinput
python manage.py shell << END
from django.contrib.auth.models import User
if not User.objects.filter(username='testuser').exists():
    User.objects.create_user(username='testuser', password='testpass123')
    print("Test user created!")
else:
    print("Test user already exists!")
END
