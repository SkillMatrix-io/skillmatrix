# enrollments/urls.py
# all urls have api/ prefix

from django.urls import path
from .views import EnrollInCourseView, learn_course_view, enrollment_list_view

urlpatterns = [
    path("enrollments/", EnrollInCourseView.as_view(), name="enrollments"),
    path("learn_course/<int:course_id>", learn_course_view, name="learn_course"),
    path("my_enrollments/",enrollment_list_view,name="my_enrollments")
]
