from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view,authentication_classes, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from user.authentication import CookieJWTAuthentication
from rest_framework.generics import ListAPIView
from .models import Course, Category
from .serializers import CategorySerializer, CourseSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
import json
import pprint

@api_view(['POST'])
@authentication_classes([CookieJWTAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def course_create_view(request):
    # Parse 'lessons' from string to list of dicts
    lessons_data = json.loads(request.data.get('lessons', '[]'))

    for i, lesson in enumerate(lessons_data):
        file_key = lesson.get('content_file')
        if file_key in request.FILES:
            lesson['content_file'] = request.FILES[file_key]
        else:
            lesson['content_file'] = None

    def str_to_bool(value):
        return str(value).lower() in ['true', '1', 'yes']

    try:
        price_val = float(request.data.get('price', 0))
    except ValueError:
        price_val = 0

    data = {
        'title': request.data.get('title', ''),
        'description': request.data.get('description', ''),
        'price': price_val,
        'is_published': str_to_bool(request.data.get('is_published', False)),
        'categories': request.data.getlist('categories'),
        'lessons': lessons_data
    }

    pprint.pprint(data)

    serializer = CourseSerializer(data=data, context={'request': request})
    if serializer.is_valid():
        serializer.save()  # Optional if needed
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [AllowAny]

@api_view(['GET'])
@permission_classes([AllowAny])
def course_list_view(request):
    courses = Course.objects.filter(is_published=True)
    return courses

@api_view(['GET'])
@permission_classes([AllowAny])
def course_detail_view(request, course_id):
    course = get_object_or_404(Course, pk=course_id, is_published=True)
    lessons = course.lessons.all()
    return course, lessons

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def instructor_course_list_view(request):
#     courses = Course.objects.filter(instructor=request.user)
#     return courses

# def instructor_course_create_view(request):
#     if request.method == 'POST':
#         form = CourseForm(request.POST, request.FILES)
#         if form.is_valid():
#             course = form.save(commit=False)
#             course.instructor = request.user
#             course.save()
#             form.save_m2m()
#             messages.success(request, 'Course created successfully')
#             return redirect('courses:instructor_course_list')
#     else:
#         form = CourseForm()
#     return render(request, 'courses/instructor_course_form.html', {'form': form, 'create': True})

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
