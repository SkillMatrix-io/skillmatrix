from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from user.authentication import CookieJWTAuthentication
from rest_framework.generics import ListAPIView
from .models import Course, Category
from rest_framework.response import Response
from .serializers import CategorySerializer, CourseSerializer,CourseCardSerializer

# @api_view(['POST'])
# @authentication_classes([CookieJWTAuthentication])
# @permission_classes([IsAuthenticated])
# @parser_classes([MultiPartParser, FormParser])
# def course_create_view(request):
#     # Parse 'lessons' from string to list of dicts
#     lessons_data = json.loads(request.data.get('lessons', '[]'))

#     for i, lesson in enumerate(lessons_data):
#         file_key = lesson.get('content_file')
#         if file_key in request.FILES:
#             lesson['content_file'] = request.FILES[file_key]
#         else:
#             lesson['content_file'] = None

#     def str_to_bool(value):
#         return str(value).lower() in ['true', '1', 'yes']

#     try:
#         price_val = float(request.data.get('price', 0))
#     except ValueError:
#         price_val = 0

#     data = {
#         'title': request.data.get('title', ''),
#         'description': request.data.get('description', ''),
#         'price': price_val,
#         'is_published': str_to_bool(request.data.get('is_published', False)),
#         'categories': request.data.getlist('categories'),
#         'lessons': lessons_data
#     }

#     pprint.pprint(data)

#     serializer = CourseSerializer(data=data, context={'request': request})
#     if serializer.is_valid():
#         serializer.save()  # Optional if needed
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
    
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [AllowAny]

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def course_list_view(request):
#     # courses = Course.objects.filter(is_published=True) #query to filter courses
#     courses = Course.objects #query to filter courses
#     serializer = CourseSerializer(courses, many=True) #running the query to db thru serializer 
#     print("Courses sent: ",serializer.data)
#     return Response(serializer.data)
@api_view(['GET'])
@permission_classes([AllowAny])
def course_list_view(request):
    # courses = Course.objects.filter(is_published=True) #query to filter courses
    courses = (
    Course.objects.filter(is_published=True).select_related("instructor")  # join user table
    .only(
        "id",
        "title",
        "price",
        "description",
        "cover_image",
        "instructor__username", #from meta
    ))
    serializer = CourseCardSerializer(courses, many=True) #running the query to db thru serializer 
    print("Courses sent: ",serializer.data)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def course_detail_view(request, course_id):
    course = get_object_or_404(Course, pk=course_id, is_published=True)
    lessons = course.lessons.all()
    return course, lessons

# Course.objects.filter(teacher=request.user)
#     .select_related("teacher")
#     .only("id", "title", "cover_image", "price", "description")

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def instructor_course_list_view(request):
    courses = (
        Course.objects
        .filter(instructor=request.user)
        .select_related("instructor")
        .only("id", "title", "price", "description", "instructor__username")
    )
    serializer = CourseCardSerializer(courses, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def publish_view(request,pk):
    status = request.data.get("status")
    if status == False:
        Course.objects.filter(pk=pk).update(is_published=True)
        return Response({"status":"Published"})
    else:
        Course.objects.filter(pk=pk).update(is_published=False)
        return Response({"status":"Unpublished"})
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_view(request,pk):
    try:
        course = Course.objects.get(pk=pk, instructor=request.user)
        course.delete()
        return Response({"status":"deleted"},status=204)
    except Course.DoesNotExist:
        return Response({"error":"Course not found"},status=404)
# def instructor_course_update_view(request, course_id):
#     course = get_object_or_404(Course, pk=course_id, instructor=request.user)
#     if request.method == 'POST':
#         form = CourseForm(request.POST, request.FILES, instance=course)
#         if form.is_valid():
#             form.save()
#             messages.success(request, 'Course updated successfully')
#             return redirect('courses:instructor_course_list')
#     else:
#         form = CourseForm(instance=course)
#     return render(request, 'courses/instructor_course_form.html', {'form': form, 'create': False, 'course': course})

# def instructor_course_delete_view(request, course_id):
#     course = get_object_or_404(Course, pk=course_id, instructor=request.user)
#     if request.method == 'POST':
#         course.delete()
#         messages.success(request, 'Course deleted')
#         return redirect('courses:instructor_course_list')
#     return render(request, 'courses/instructor_course_confirm_delete.html', {'course': course})


# def bootstrap_test_view(request):
#     return render(request, 'courses/test_child.html')
