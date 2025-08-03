from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('',views.registerPageView,name='registerPage'),
    path('register/', views.registerPageView, name='registerPage'),
    path('login/', views.loginView, name='loginPage'),
    path('logout/', views.logOutView, name='logOutPage'),
    path('dashboard/', views.dashboardView, name='dashboardPage'),
]
