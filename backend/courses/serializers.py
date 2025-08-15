# courses/serializers.py
from rest_framework import serializers #type: ignore
from .models import Course, Lesson, Category
from .utils.supabase import upload_lesson_file

class LessonSerializer(serializers.ModelSerializer):
    content_file = serializers.FileField(write_only=True, required=False)
    class Meta:
        model = Lesson
        exclude = ['course']

class CourseCardSerializer(serializers.ModelSerializer):
    instructor_username = serializers.CharField(source="instructor.username", read_only=True)

    class Meta:
        model = Course
        fields = ["id", "title", "price", "description", "cover_image", "instructor_username"]

class CourseDialogSerializer(serializers.ModelSerializer):
    instructor_username = serializers.CharField(source="instructor.username", read_only=True)

    class Meta:
        model = Course
        fields = ["id", "title", "price", "description", "cover_image", "instructor_username"]
        # exclude = []

# Serializers convert Django models ↔ JSON and do field-level validation.
class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, required=False)
    categories = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True)

    class Meta:
        model = Course
        fields = '__all__'
        # bad fetching lol ^
        read_only_fields = ['instructor']
    # since we are trying to send nested queries we'll set up nested serializer for lesson here 

    def create(self,validated_data):
        instructor = self.context['request'].user
        lessons_data = validated_data.pop('lessons',[])
        categories_data = validated_data.pop('categories',[])

        course = Course.objects.create(instructor=instructor,**validated_data)
        course.categories.set(categories_data)

        for lesson_data in lessons_data:
            file = lesson_data.pop('content_file', None)
            if file:
                public_url = upload_lesson_file(file,lesson_data.get('title','untitled'))
                lesson_data['content_url'] = public_url
            Lesson.objects.create(course=course, **lesson_data)

        return course
    
    def update(self, instace, validated_data):
        lessons_data = validated_data.get('lessons',[])
        categories_data = validated_data.get('categories',None)

        if categories_data:
            instace.categories.set(categories_data)

        for lesson_data in lessons_data:
            file = lessons_data.pop('content_file',None)
            if file:
                public_url = upload_lesson_file(file,lesson_data.get('title','untitled'))
                lesson_data['content_url'] = public_url
            Lesson.objects.update_or_create(
                course = instace,
                title = lesson_data.get('title'),
                defaults=lesson_data
            )
        return super().update(instace,validated_data)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
        
# serializer = CourseSerializer(data=request.data)
# serializer.is_valid() lets us validate all the fields placed in the course
# good for forming many to many and such relations with other tables