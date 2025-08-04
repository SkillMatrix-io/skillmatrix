# backend/user/serializers.py
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, validators=[validate_password])
    email = serializers.EmailField(required=True)
    role = serializers.ChoiceField(choices=[('student', 'Student'), ('teacher', 'Teacher')])  # adjust if needed
    class Meta:
        model=User
        fields=('username','email','password','role','bio')
    def create(self, validated_data):
        user=User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role'],
            bio=validated_data.get('bio', '')  # optional fallback
        )
        return user
    # create_user hashes the password 
    # object.create() stores raw password

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(trim_whitespace=True)
    password = serializers.CharField()
    role = serializers.ChoiceField(choices=['student','teacher'])

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'role', 'bio', 'avatar_url')  # add 'avatar_url' or others if needed
