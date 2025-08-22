from django.db import models
from user.models import User  # Adjust if your user app name is different
from django.core.exceptions import ValidationError
import os

class Category(models.Model):
    name = models.CharField(max_length=64, unique=True)
    
    def __str__(self):
        return self.name

class Course(models.Model):
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')
    title = models.CharField(max_length=255)
    description = models.TextField()
    categories = models.ManyToManyField(Category, blank=True, related_name='courses')
    cover_image = models.URLField(null=True, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    is_published = models.BooleanField(default=False)
    rating = models.FloatField(default=0)
    total_students = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Lesson(models.Model):
    CONTENT_TYPE_CHOICES = [
        ('video', 'Video'),
        ('pdf', 'PDF'),
    ]

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='lessons'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)  # optional summary

    # only applies if a file/video is uploaded
    content_type = models.CharField(
        max_length=20,
        choices=CONTENT_TYPE_CHOICES,
        blank=True,
        null=True
    )

    # public file URL (generated from upload)
    content_url = models.URLField(blank=True, null=True)

    # optional markdown text
    text_content = models.TextField(blank=True, null=True)

    order = models.PositiveIntegerField()
    is_preview = models.BooleanField(default=False)

    class Meta:
        ordering = ['order']

    def clean(self):
        if not self.text_content and not self.content_url:
            raise ValidationError("A lesson must have at least text content or a file (video/pdf).")

        # If file exists but content_type missing, try auto-detect
        if self.content_url and not self.content_type:
            ext = os.path.splitext(self.content_url)[1].lower()
            if ext in ['.mp4', '.mov', '.avi', '.mkv']:
                self.content_type = 'video'
            elif ext in ['.pdf']:
                self.content_type = 'pdf'
            else:
                raise ValidationError(f"Unknown file type: {ext}")


    def __str__(self):
        return f"{self.course.title} - {self.title}"