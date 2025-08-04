from django.urls import path
from . import views

app_name = 'courses'

urlpatterns = [
    # Publicly accessible pages
    path('', views.course_list_view, name='course_list'),
    path('<int:course_id>/', views.course_detail_view, name='course_detail'),

    # Instructor-only pages
    path('instructor/', views.instructor_course_list_view, name='instructor_course_list'),
    path('instructor/create/', views.instructor_course_create_view, name='instructor_course_create'),
    path('instructor/<int:course_id>/edit/', views.instructor_course_update_view, name='instructor_course_update'),
    path('instructor/<int:course_id>/delete/', views.instructor_course_delete_view, name='instructor_course_delete'),
    path('test-bootstrap/', views.bootstrap_test_view, name='bootstrap_test'),

]
