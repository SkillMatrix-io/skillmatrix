from django import forms
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages

from .models import Course, Category

class CourseForm(forms.ModelForm):
    categories = forms.ModelMultipleChoiceField(
        queryset=Category.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False,
    )

    class Meta:
        model = Course
        fields = ['title', 'description', 'cover_image', 'price', 'is_published', 'categories']

def course_list_view(request):
    courses = Course.objects.filter(is_published=True)
    return render(request, 'courses/course_list.html', {'courses': courses})

def course_detail_view(request, course_id):
    course = get_object_or_404(Course, pk=course_id, is_published=True)
    lessons = course.lessons.all()
    return render(request, 'courses/course_detail.html', {'course': course, 'lessons': lessons})

@login_required
def instructor_course_list_view(request):
    courses = Course.objects.filter(instructor=request.user)
    return render(request, 'courses/instructor_course_list.html', {'courses': courses})

@login_required
def instructor_course_create_view(request):
    if request.method == 'POST':
        form = CourseForm(request.POST, request.FILES)
        if form.is_valid():
            course = form.save(commit=False)
            course.instructor = request.user
            course.save()
            form.save_m2m()
            messages.success(request, 'Course created successfully')
            return redirect('courses:instructor_course_list')
    else:
        form = CourseForm()
    return render(request, 'courses/instructor_course_form.html', {'form': form, 'create': True})

@login_required
def instructor_course_update_view(request, course_id):
    course = get_object_or_404(Course, pk=course_id, instructor=request.user)
    if request.method == 'POST':
        form = CourseForm(request.POST, request.FILES, instance=course)
        if form.is_valid():
            form.save()
            messages.success(request, 'Course updated successfully')
            return redirect('courses:instructor_course_list')
    else:
        form = CourseForm(instance=course)
    return render(request, 'courses/instructor_course_form.html', {'form': form, 'create': False, 'course': course})

@login_required
def instructor_course_delete_view(request, course_id):
    course = get_object_or_404(Course, pk=course_id, instructor=request.user)
    if request.method == 'POST':
        course.delete()
        messages.success(request, 'Course deleted')
        return redirect('courses:instructor_course_list')
    return render(request, 'courses/instructor_course_confirm_delete.html', {'course': course})


def bootstrap_test_view(request):
    return render(request, 'courses/test_child.html')
