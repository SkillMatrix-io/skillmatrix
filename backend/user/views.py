from rest_framework_simplejwt.tokens import RefreshToken 
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from .serializers import LoginSerializer, RegisterSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        role = serializer.validated_data['role']

        user = authenticate(request, username=username, password=password)
        # the authenticate uses the default model sepcified in settings.py 
        # look up AUTH_USER_MODEL which is user/models.py -> User
        if not user:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        if user.role != role:
            return Response({'message': 'User role mismatch'}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)

        response = Response({
            'message': 'Login successful',
            'role': user.role
        }, status=status.HTTP_200_OK)

        response.set_cookie('access', str(refresh.access_token), httponly=True)
        response.set_cookie('refresh', str(refresh), httponly=True)

        return response

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save() #serializer handles creation

        # auto-login
        refresh = RefreshToken.for_user(user)
        response = Response({
            'message':'Registration successful',
            'role':user.role,
        }, status=status.HTTP_201_CREATED)
        
        response.set_cookie('access',str(refresh.access_token), httponly=True) #important - storing login token in http only cookies - not on local machine
        response.set_cookie('refresh',str(refresh),httponly=True)
        return response
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Replaced JsonResponse with DRF Response objects