# enrollments/urls.py
# all urls have api/ prefix

from django.urls import path
from .views import EnrollInCourseView

urlpatterns = [
    path("enrollments/", EnrollInCourseView.as_view(), name="login"),
]
