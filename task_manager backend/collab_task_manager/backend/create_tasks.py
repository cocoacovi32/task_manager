from django.contrib.auth.models import User
from api.models import Task
from datetime import datetime, timedelta

user = User.objects.first()
Task.objects.create(
    title="Setup Project",
    description="Configure Django and React",
    priority="High",
    deadline=datetime.now() + timedelta(days=7),
    assigned_to=user
)
Task.objects.create(
    title="API Endpoints",
    description="Create REST API endpoints",
    priority="Medium",
    deadline=datetime.now() + timedelta(days=10),
    assigned_to=user
)
print("Tasks created!")
