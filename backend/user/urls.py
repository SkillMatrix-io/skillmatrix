from django.urls import path
from .views import login_view, register_view, logout_view, get_user_by_id, session_view, save_bio

urlpatterns = [
    path("auth/login/", login_view, name="login"),
    path("auth/register/", register_view, name="register"),
    path("auth/logout/", logout_view, name="logout"),
    path("users/<int:pk>/", get_user_by_id, name="get_user"),
    path("users/save-bio/<int:pk>/", save_bio, name="get_user"),
    path("session/", session_view, name="session"),
]
# ${process.env.REACT_APP_API_URL}/api/user/save-bio/${storedUser.id}/