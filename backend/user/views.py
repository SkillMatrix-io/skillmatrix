from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login

from rest_framework.response import Response
from rest_framework import status
from .serializers import LoginSerializer, RegisterSerializer, UserSerializer #we made these in serializer file
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken, TokenError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
import datetime

User = get_user_model()

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
            'username': user.username,
            'id':user.id,
            'avatar':user.avatar,
        }, status=status.HTTP_201_CREATED)
        
        response.set_cookie('access',str(refresh.access_token), httponly=True,max_age=60*60*24, secure=True, samesite="None") #important - storing login token in http only cookies - not on local machine

        response.set_cookie('refresh',str(refresh),httponly=True, max_age=60*60*24*30, secure=True, samesite="None")
        print(str(refresh.access_token))

        return response
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        role = serializer.validated_data['role']

        user = authenticate(request, username=username, password=password)
        if not user:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        if user.role != role:
            return Response({'message': 'User role mismatch'}, status=status.HTTP_403_FORBIDDEN)
        
        # ✅ Update last login
        update_last_login(None, user)

        refresh = RefreshToken.for_user(user)
        response = Response({
            'message': 'Login successful',
            'role': user.role,
            'username': user.username,
            'id':user.id,
            'avatar':user.avatar,
        }, status=status.HTTP_200_OK)

        
        response.set_cookie('access',str(refresh.access_token), httponly=True,max_age=60*60*24, secure=True, samesite="None") #important - storing login token in http only cookies - not on local machine

        response.set_cookie('refresh',str(refresh),httponly=True, max_age=60*60*24*30, secure=True, samesite="None")
        return response
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @login_required
# def dashboardView(request):
#     return render(request, 'accounts/dashboard.html', {'username': request.user.username, 'role': request.user.role})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    response = Response({'message':'Logged out successfully'},status=status.HTTP_200_OK)
    response.delete_cookie('access')
    response.delete_cookie('refresh')
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_by_id(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    
    serializer = RegisterSerializer(user)  # or a different serializer for reading
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_by_username(request,username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error':'User not found'},status=404)
    seralizer = RegisterSerializer(user)

    return Response(seralizer.data)


# backend sendds two cookies - jwt token one is session - 24hrs ago 
# other is refresh 30 days age 
#  this method below ensures that if first is expire issue a new one 
# if second is expired let the user login again
# also sends over user-meta data like username, role, bio for consistency
@api_view(['GET'])
@permission_classes([AllowAny])
def session_view(request):
    access_token = request.COOKIES.get('access')
    refresh_token = request.COOKIES.get('refresh')

    user = None

    if access_token:
        try:
            access_obj = AccessToken(access_token)
            user_id = access_obj['user_id']
            user = User.objects.get(id=user_id)
            serializer = UserSerializer(user)
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except TokenError:
            pass
        except User.DoesNotExist:
            return Response({"detail": "Invalid user."}, status=status.HTTP_401_UNAUTHORIZED)

    # Try refresh token if access is invalid
    if refresh_token:
        try:
            refresh_obj = RefreshToken(refresh_token)
            user_id = refresh_obj['user_id']
            user = User.objects.get(id=user_id)

            new_access = refresh_obj.access_token
            new_access.set_exp(lifetime=datetime.timedelta(hours=24))  # Optional: force your own expiry
            # fetched user data - hehe
            response = Response(UserSerializer(user).data, status=status.HTTP_200_OK)
            response.set_cookie('access', str(new_access), httponly=True, samesite='Lax', max_age=60*60*24)
            return response

        except TokenError:
            return Response({"detail": "Refresh token expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({"detail": "Invalid user."}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({"detail": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_bio(request, pk):
    bio = str(request.data.get("bio", ""))
    user = get_object_or_404(User, pk=pk)
    # Make sure only the owner can update their bio
    if request.user != user:
        return Response({'error': 'Permission denied'}, status=403)
    user.bio = bio
    user.save()
    return Response({'message': 'Bio updated successfully', 'bio': user.bio}, status=200)