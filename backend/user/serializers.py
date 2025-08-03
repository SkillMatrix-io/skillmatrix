# backend/user/serializers.py

from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import User

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(trim_whitespace=True)
    password = serializers.CharField()
    role = serializers.ChoiceField(choices=['student','teacher'])


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    # hides pass from api responses
    role = serializers.ChoiceField(choices=['student', 'teacher'])
    # ensures only unique values are store

    class Meta:
        model = User
        fields = ['username','email', 'password','confirm_password','full_name','role','bio','avatar_url']
        # below thing might not be needed cuase write_only is true for password above anyways
        extra_kwargs = {
            'email': {'required': True},
            'full_name': {'required': True},
        }
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user
    # ** means previous value + present value
    # kinda same how ...names work in js - previous names + presnet names
    # create_user hashes the password 
    # object.create() stores raw password