from django.urls import path #type: ignore
from . import views
from .views import CategoryListAPIView
from courses.api_views import CourseCreateAPIView, CourseUpdateAPIView

app_name = 'courses'

urlpatterns = [
    # Publicly accessible pages
    path('', views.course_list_view, name='course_list'),
    path('<int:course_id>/', views.course_detail_view, name='course_detail'),

    # # Instructor-only pages
    path('instructor/', views.instructor_course_list_view, name='instructor_course_list'),
    path('create-edit/', CourseCreateAPIView.as_view(), name='api_create_course'),
    path('create-edit/<int:pk>/', CourseUpdateAPIView.as_view(), name='api_create_course'),
    path('categories/', CategoryListAPIView.as_view(), name='category-list'),
    path('publishing/<int:pk>/', views.publish_view, name='publishing'),
    path('delete/<int:pk>/', views.delete_view, name='delete'),
]