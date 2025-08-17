# courses/api_views.py
# on some research i realised unlike login/register -> @api_view(['POST'])
# was a pretty good FUNCTION based solution
# but courses gonna have a lot of - well api methods (GET,POST etc)
# and all of them will have almost same response data even tho different function
# INTRODUCING DJANGO API VIEW BUT CLASS BASED !!!!

from rest_framework.views import APIView #type: ignore
from rest_framework.permissions import IsAuthenticated #type: ignore
from rest_framework.response import Response #type: ignore
from rest_framework import status #type: ignore
from .serializers import CourseSerializer
from .models import Course
from user.authentication import CookieJWTAuthentication
from rest_framework.parsers import MultiPartParser, FormParser #type: ignore
# as serializer needs parsed input just parsing the lessons here.
from rest_framework.exceptions import NotFound

import json
import pprint


class CourseCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    parser_classes = [MultiPartParser, FormParser] 


    def post(self, request):
        # If 'lessons' came as a JSON string in formData, parse it manually
        lessons_data = json.loads(request.data.get('lessons', '[]'))
        for lesson in lessons_data:
            file_key = lesson.get('content_file')
            if file_key and file_key in request.FILES:
                # Replace with actual file object
                lesson['content_file'] = request.FILES[file_key]
            # else: leave lesson['file_url'] as-is (if provided by frontend)
        
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
        serializer = CourseSerializer(data=data, context={'request':request}) 
        # sending request as context to share instrcutor's username
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    #IMPORTANT: request.user gives u the complete user model -> the User model has all those details that are stored in the database minus ofcourse the password.

class CourseUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self, pk):
        try:
            return Course.objects.get(pk=pk, instructor=self.request.user)
        except Course.DoesNotExist:
            raise NotFound("Course not found or not owned by you.")

    def get(self, request, pk):
        course = self.get_object(pk)
        serializer = CourseSerializer(course)
        return Response(serializer.data)

    def put(self, request, pk):
        course = self.get_object(pk)

        lessons_data = json.loads(request.data.get('lessons', '[]'))
        for lesson in lessons_data:
            file_key = lesson.get('content_file')
            if file_key and file_key in request.FILES:
                lesson['content_file'] = request.FILES[file_key]
            # else → leave `file_url` if provided, don’t overwrite with None ✅

        try:
            price_val = float(request.data.get('price', 0))
        except ValueError:
            price_val = 0

        data = {
            'title': request.data.get('title', course.title),
            'description': request.data.get('description', course.description),
            'price': price_val,
            'is_published': str(request.data.get('is_published', course.is_published)).lower() in ['true', '1', 'yes'],
            'categories': request.data.getlist('categories') or [c.id for c in course.categories.all()],
            'lessons': lessons_data
        }

        serializer = CourseSerializer(course, data=data, partial=False, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        course = self.get_object(pk)

        lessons_data = json.loads(request.data.get('lessons', '[]'))
        for lesson in lessons_data:
            file_key = lesson.get('content_file')
            if file_key and file_key in request.FILES:
                lesson['content_file'] = request.FILES[file_key]
            # else: let file_url flow through

        data = request.data.copy()
        if lessons_data:
            data['lessons'] = lessons_data

        serializer = CourseSerializer(course, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
