from django.contrib import admin
from .models import Category, Course, Lesson

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'instructor', 'price', 'is_published', 'rating', 'total_students', 'created_at']
    list_filter = ['is_published', 'categories', 'created_at']
    search_fields = ['title', 'description']

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'content_type', 'order']
    list_filter = ['content_type', 'course']
    ordering = ['course', 'order']
