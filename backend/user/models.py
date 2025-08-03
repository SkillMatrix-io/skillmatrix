from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    )
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    avatar_url = models.URLField(blank=True, null=True, default='https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png')
    bio = models.TextField(blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(blank=True, null=True)  # handled by Django
    def __str__(self):
        return f"{self.username} ({self.role})"
# this model for login / registration 

# AVATAR_CHOICES = [
# ("avatar1.png", "Avatar 1"),
# ("avatar2.png", "Avatar 2"),
# ("avatar3.png", "Avatar 3"),
# ("avatar4.png", "Avatar 4"),
# # ... add up to 10
# ]
# avatar_url = models.CharField(max_length=255, choices=AVATAR_CHOICES, default="avatar1.png")