from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from user.authentication import CookieJWTAuthentication
from rest_framework.generics import ListAPIView
from .models import Course, Category
from rest_framework.response import Response
from .serializers import CategorySerializer,CourseCardSerializer, CourseDialogSerializer
from pprint import pprint

class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [AllowAny]

@api_view(['GET'])
@permission_classes([AllowAny])
def course_list_view(request):
    # courses = Course.objects.filter(is_published=True) #query to filter courses
    courses = (
    Course.objects.filter(is_published=True).select_related("instructor").prefetch_related("categories")  # join user table
    .only(
        "id",
        "title",
        "price",
        "description",
        "cover_image",
        "rating",
        "instructor__username", #from meta
    ))
    serializer = CourseCardSerializer(courses, many=True) #running the query to db thru serializer 
    print("Courses sent: ",serializer.data)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def course_detail_view(request, course_id):
    course = get_object_or_404(
        Course.objects.select_related("instructor").prefetch_related("categories"),
        pk=course_id,
        is_published=True
    )
    serializer = CourseDialogSerializer(course, many=False)
    pprint(serializer.data)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def instructor_course_list_view(request):
    courses = (
        Course.objects
        .filter(instructor=request.user)
        # .select_related("instructor")
        .only("id", "title","is_published")
    )
    serializer = CourseCardSerializer(courses, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def publish_view(request, pk):
    status_value = str(request.data.get("status")).lower() in ["true", "1", "yes"]

    Course.objects.filter(pk=pk).update(is_published=status_value)

    return Response({
        "status": "Published" if status_value else "Unpublished",
        "is_published": status_value
    })
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_view(request,pk):
    try:
        course = Course.objects.get(pk=pk, instructor=request.user)
        course.delete()
        return Response({"status":"deleted"},status=204)
    except Course.DoesNotExist:
        return Response({"error":"Course not found"},status=404)