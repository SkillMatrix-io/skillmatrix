from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Enrollment
from .serializers import EnrollmentCreateSerializer, EnrollmentDetailSerializer

class EnrollInCourseView(generics.CreateAPIView):
    # compared to APIview it gives more boilerpalte - - not having to define stuff like get post methods
    permission_class = [IsAuthenticated]
    serializer_class = EnrollmentCreateSerializer

    def perform_create(self,serializer):
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response(
            {"message": "Enrollment successful", "data": response.data},
            status=status.HTTP_201_CREATED
        )