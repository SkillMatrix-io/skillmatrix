# courses/api_views.py
# first question why?
# on some research i realised unlike login/register -> @api_view(['POST'])
# was a pretty good FUNCTION based solution
# but courses gonna have a lot of - well api methods (GET,POST etc)
# and all of them will have almost same response data even tho different function
# INTRODUCING DJANGO API VIEW BUT CLASS BASED !!!!

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import CourseSerializer
from user.authentication import CookieJWTAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
# as serializer needs parsed input just parsing the lessons here.

import json
import pprint


class CourseCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]
    # above lines same as these in users/views.py

    parser_classes = [MultiPartParser, FormParser] 


    def post(self, request):
        # If 'lessons' came as a JSON string in formData, parse it manually
        # data = request.data.copy()
        lessons_data = json.loads(request.data.get('lessons', '[]'))
        for i, lesson in enumerate(lessons_data):
            file_key = lesson.get('content_file')
            # imp for files---->
            if file_key in request.FILES:
                lesson['content_file'] = request.FILES[file_key]
            else:
                lesson['content_file'] = None
            # if 'lessons' in data and isinstance(data['lessons'],str):
            #     try:
            #         data['lessons'] = json.loads(data['lessons'])
            #     except json.JSONDecodeError:
            #         return Response({"lessons":"Invalid JSON format"},status=status.HTTP_400_BAD_REQUEST)
            # data = dict(request.data)
            # data['lessons'] = lessons_data
        
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
        serializer = CourseSerializer(data=data, context={'request':request}) # sending request as context to share instrcutor's username
        if serializer.is_valid():
            # serializer.save(instructor=request.user)
            serializer.save()
            # serializer.save(instructor='dummy guy')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    #IMPORTANT: request.user gives u the complete user model -> the User model has all those details that are stored in the database minus ofcourse the password.


# {
#   "title": "Course Title",
#   "description": "Some info",
#   "lessons": [
#     {
#       "title": "Lesson 1",
#       "content_type": "video",
#       "video_url": "https://youtube.com/...",
#       "order": 1
#     },
#     {
#       "title": "Lesson 2",
#       "content_type": "pdf",
#       "content_file": null,
#       "order": 2
#     }
#   ]
# }