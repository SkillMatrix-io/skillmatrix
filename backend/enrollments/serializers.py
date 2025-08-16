# enrollments/serializers.py
from rest_framework import serializers
from .models import Enrollment, LessonProgress

class EnrollmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['course','access_type']

class EnrollmentDetailSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title',read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            'id','course','course_title','access_type','status','progress_percent','rating','review'
        ]