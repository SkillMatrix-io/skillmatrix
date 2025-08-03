from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from .serializers import LoginSerializer, RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

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
        refresh = RefreshToken.for_user(user)
        response = Response({
            'message': 'Login successful',
            'role': user.role
        }, status=status.HTTP_200_OK)
        response.set_cookie('access', str(refresh.access_token), httponly=True, secure=True, samesite='Lax')
        response.set_cookie('refresh', str(refresh), httponly=True)
        return response
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @login_required
# def dashboardView(request):
#     return render(request, 'accounts/dashboard.html', {'username': request.user.username, 'role': request.user.role})

# @login_required
# def logout_view(request):
#     logout(request)
#     messages.info(request, "Logged out successfully")
#     return redirect('loginPage')
