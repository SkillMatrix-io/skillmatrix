from django.urls import path
from .views import login_view, register_view, logout_view, get_user_by_id, session_view

urlpatterns = [
    path("auth/login/", login_view, name="login"),
    path("auth/register/", register_view, name="register"),
    path("auth/logout/", logout_view, name="logout"),
    path("users/<int:pk>/", get_user_by_id, name="get_user"),
    path("session/", session_view, name="session"),
]
