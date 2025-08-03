from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import RegisterForm, LoginForm

def registerPageView(request):
    if request.user.is_authenticated:
        return redirect('dashboardPage')

    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            messages.success(request, "Account created! Please log in.")
            return redirect('loginPage')
    else:
        form = RegisterForm()
    return render(request, 'accounts/register.html', {'form': form})

def loginView(request):
    if request.user.is_authenticated:
        return redirect('dashboardPage')
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)
                return redirect('dashboardPage')
            else:
                messages.error(request, "Invalid credentials")
    else:
        form = LoginForm()
    return render(request, 'accounts/login.html', {'form': form})

@login_required
def dashboardView(request):
    return render(request, 'accounts/dashboard.html', {'username': request.user.username, 'role': request.user.role})

@login_required
def logOutView(request):
    logout(request)
    messages.info(request, "Logged out successfully")
    return redirect('loginPage')
