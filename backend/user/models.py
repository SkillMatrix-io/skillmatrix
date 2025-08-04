from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        # ('instructor', 'Instructor'),
        ('student', 'Student'),
    )
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    bio = models.TextField(blank=True, null=True, default='pls work')
    full_name = models.CharField(max_length=100, blank=True)
    avatar_url = models.URLField(blank=True, null=True, default='https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png')
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(blank=True, null=True)  # handled by Django
    def __str__(self):
        return f"{self.username} ({self.role})"
    
# AVATAR_CHOICES = [
# ("avatar1.png", "Avatar 1"),
# ("avatar2.png", "Avatar 2"),
# ("avatar3.png", "Avatar 3"),
# ("avatar4.png", "Avatar 4"),
# # ... add up to 10
# ]
# avatar_url = models.CharField(max_length=255, choices=AVATAR_CHOICES, default="avatar1.png")
