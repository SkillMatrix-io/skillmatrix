from django.urls import path
from .views import login_view, register_view

urlpatterns = [
    path("auth/login/", login_view, name="login"),
    path("auth/register/", register_view, name="register"),
]
# from main urls.py api/ from this urls.py auth/login 
# so the link become api/auth/login/ crazy right
