from rest_framework import generics, status #type: ignore
from rest_framework.response import Response #type: ignore
from rest_framework.permissions import IsAuthenticated #type: ignore
from .models import Enrollment, LessonProgress
from courses.models import Lesson
from .serializers import EnrollmentCreateSerializer, EnrollmentDetailSerializer, EnrollmentFeedbackSerializer
from rest_framework.decorators import api_view, permission_classes #type: ignore
from django.shortcuts import get_object_or_404 #type: ignore

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
    
class UnenrollFromCourseView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Enrollment.objects.all()

    def delete(self, request, *args, **kwargs):
        enrollment_id = kwargs.get("pk")
        try:
            enrollment = Enrollment.objects.get(pk=enrollment_id, user=request.user)
            enrollment.delete()
            return Response({"message": "Unenrolled successfully"}, status=status.HTTP_200_OK)
        except Enrollment.DoesNotExist:
            return Response({"message": "Enrollment not found"}, status=status.HTTP_404_NOT_FOUND)
        

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
            "description":enrollment.course.description,
            "rating":enrollment.course.rating,
        },
        "lessons": lesson_data,
        "rating":enrollment.rating or -1,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def enrollment_list_view(request):
    enrollments = (
        Enrollment.objects
        .filter(user = request.user)
        .select_related("course")
        .only("id","course","progress_percent")
    )
    serializer = EnrollmentDetailSerializer(enrollments,many=True)
    print(serializer.data)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_feedback_view(request, course_id):
    enrollment = get_object_or_404(
        Enrollment,
        course_id=course_id,
        user=request.user
    )

    serializer = EnrollmentFeedbackSerializer(enrollment, data=request.data,partial=True)

    if serializer.is_valid():
        serializer.save()

    course = enrollment.course
    ratings = Enrollment.objects.filter(course=course, rating__isnull=False).values_list("rating",flat=True)

    if ratings:
        course.rating = sum(ratings) / len(ratings)
        course.save(update_fields=["rating"])

        return Response({"message": "Feedback submitted successfully!"}, status=200)
    return Response(serializer.errors, status=400)