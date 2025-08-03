from rest_framework import serializers
from .models import User

class UserRegisterationSerializer(serializers.ModelSerializer):
    password=serializers.CharFeild()
    class Meta:
        model:User
        fields=('username','email','password','role')
    def create(self, validated_data):
        user=User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role']
        )
        return user