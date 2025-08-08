# courses/serializers.py
from rest_framework import serializers
from .models import Course, Lesson, Category


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        exclude = ['course']

# Serializers convert Django models ↔ JSON and do field-level validation.
class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, required=False)
    categories = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True)
    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ['instructor']
    # since we are trying to send nested queries we'll set up nested serializer for lesson here 
    def create(self,validated_data):
        instructor = self.context['request'].user
        lessons_data = validated_data.pop('lessons',[])
        categories_data = validated_data.pop('categories',[])

        course = Course.objects.create(instructor=instructor,**validated_data)
        course.categories.set(categories_data)

        for lesson_data in lessons_data:
            Lesson.objects.create(course=course, **lesson_data)
        return course
    
    # def update(self,validated_data):
    #     lessons_data = validated_data.pop('lessons',[])
    #     categories_data = validated_data.pop('categories',[])

    #     course = Course.objects.create(**validated_data)
    #     course.categories.set(categories_data)

    #     for lesson_data in lesson_data:
    #         Lesson.objects.create(course=course, **lessons_data)
    #     return course

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
        
# example payload 
# {
#   "title": "React Bootcamp",
#   "description": "Best course ever",
#   "price": 99,
#   "categories": [1, 2, 3],
#   "is_published": true
# }
# serializer = CourseSerializer(data=request.data)
# serializer.is_valid() lets us validate all the fields placed in the course
# good for forming many to many and such relations with other tables