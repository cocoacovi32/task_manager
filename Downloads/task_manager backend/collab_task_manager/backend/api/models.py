from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    priority = models.CharField(max_length=20, default='Medium')
    deadline = models.DateTimeField()
    # Link to one of your 5 group members
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')

class Comment(models.Model):
    # Chat functionality
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
