from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Enrollment(models.Model):
    ACCESS_CHOICES =[
        ('normal','Normal'),
        ('audit','Audit'),
    ]
    STATUS_CHOICES = [
        ('active','Active'),
        ('paused','Paused'),
        ('completed','Completed'),
        ('cancelled','Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='enrollments')
    course = models.ForeignKey('courses.Course',on_delete=models.CASCADE,related_name='enrollments')

    date_enrolled = models.DateTimeField(auto_now_add=True)
    access_type = models.CharField(max_length=20,choices=ACCESS_CHOICES,default='normal')
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='active')

    progress_percent = models.FloatField(default=0.0)
    completion_date = models.DateTimeField(null=True,blank=True)

    rating = models.PositiveSmallIntegerField(null=True,blank=True)
    review = models.TextField(blank=True)

    class Meta:
        unique_together = ('user','course')
        verbose_name = 'Enrollment'
        verbose_name_plural = 'Enrollments'

    def __str__(self):
        return f"{self.user} -> {self.course} ({self.access_type})"
    
class LessonProgress(models.Model):
    enrollment = models.ForeignKey(Enrollment,on_delete=models.CASCADE,related_name="lesson_progress")
    lesson = models.ForeignKey('courses.Lesson',on_delete=models.CASCADE)

    is_done = models.BooleanField(default=False)
    date_completed = models.DateTimeField(null = True, blank=True)

    class Meta:
        unique_together = ('enrollment','lesson')
        verbose_name = 'Lesson Progress'
        verbose_name_plural = 'Lesson Progress Records'

    def __str__(self):
        return f"{self.enrollment.user} - {self.lesson} ({'Done' if self.is_done else 'Pending'})"