from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Enrollment, LessonProgress
from courses.models import Lesson
from .serializers import EnrollmentCreateSerializer, EnrollmentDetailSerializer
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404

class EnrollInCourseView(generics.CreateAPIView):
    # compared to APIview it gives more boilerpalte - - not having to define stuff like get post methods
    permission_classes = [IsAuthenticated]
    serializer_class = EnrollmentCreateSerializer

    def perform_create(self,serializer):
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response(
            {"message": "Enrollment successful", "data": response.data},
            status=status.HTTP_201_CREATED
        )
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def learn_course_view(request,course_id):
    enrollment = get_object_or_404(
        Enrollment.objects.select_related("course"),
        course_id=course_id,
        user=request.user
    )

    lessons = Lesson.objects.filter(course_id=course_id).order_by("order")

    progress_map = {
    lp.lesson_id: lp.is_done
    for lp in LessonProgress.objects.filter(
        enrollment=enrollment
    ).only("lesson_id", "is_done")
    }

    lesson_data = [
        {
            "id":lesson.id,
            "title":lesson.title,
            "description":lesson.description,
            "content_type":lesson.content_type,
            "text_content":lesson.text_content,
            "content_url":lesson.content_url,
            "completed":progress_map.get(lesson.id,False)
        }
        for lesson in lessons
    ]

    return Response({
        "course":{
            "id":enrollment.course.id,
            "title":enrollment.course.title,
            "description":enrollment.course.description
        },
        "lessons": lesson_data
    })