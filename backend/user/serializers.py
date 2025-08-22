# backend/user/serializers.py
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Username must be unique")]
    )
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Email must be unique")]
    )
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )
    role = serializers.ChoiceField(
        choices=[('student', 'Student'), ('teacher', 'Teacher')]
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role', 'bio', 'avatar')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role'],
            bio=validated_data.get('bio', ''),      # optional
            avatar=validated_data.get('avatar', '1') # default avatar
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
        fields = ('id', 'username', 'role', 'bio', 'avatar')  # add 'avatar_url' or others if needed
