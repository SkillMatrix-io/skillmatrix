from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import User

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    role = serializers.ChoiceField(choices=['student','teacher'])


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True)
    # hides pass from api responses
    role = serializers.ChoiceField(choices=['student', 'teacher'])
    # ensures only unique values are store

    class Meta:
        model = User
        fields = ['username', 'password', 'role']
        # below thing might not be needed cuase write_only is true for password above anyways
        # extra_kwargs = {
        #     'password': {'write_only': True}
        #     # ensure its never in the reads of the serializers
        # }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    # ** means previous value + present value
    # kinda same how ...names work in js - previous names + presnet names
    # create_user hashes the password 
    # object.create() stores raw password