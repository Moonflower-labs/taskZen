from datetime import datetime, timedelta
from django.db import models
from django.contrib.auth.models import AbstractUser


class Role(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('employee', 'Employee'),
    ]
    name = models.CharField(max_length=50, choices=ROLE_CHOICES)

    def __str__(self):
        return self.get_name_display()


class User(AbstractUser):
    company = models.ForeignKey('Company', on_delete=models.SET_NULL,
                                blank=True, null=True, related_name='tasks_assigned')
    teams = models.ManyToManyField(
        'Team', blank=True, related_name='users')
    roles = models.ManyToManyField(Role)

    def has_manager_or_admin_role(self):
        return self.roles.filter(name='manager').exists() or self.roles.filter(name='admin').exists()

    def __str__(self):
        return self.username


class Task(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewing', 'Reviewing'),
        ('complete', 'Complete'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('med', 'Medium'),
        ('high', 'High'),
    ]
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    due_date = models.DateField(
        default=datetime.now() + timedelta(days=14))
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(
        max_length=20, choices=PRIORITY_CHOICES, default='low')
    assigned_to = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True, related_name='tasks_assigned')
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, related_name='tasks_created')
    visibility = models.CharField(
        max_length=20, choices=VISIBILITY_CHOICES, default='public')
    created_at = models.DateTimeField(
        auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    company = models.ForeignKey(
        'Company', on_delete=models.CASCADE, null=True, related_name='tasks')

    def __str__(self):
        return self.title


class TaskReview(models.Model):
    REVIEW_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='task_reviews')
    comments = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=REVIEW_STATUS_CHOICES)
    review_date = models.DateTimeField(
        auto_now_add=True)

    def __str__(self):
        return self.comments


class TaskComment(models.Model):
    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    date = models.DateTimeField(
        auto_now_add=True)

    def __str__(self):
        return self.text


class Project(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField()
    tasks = models.ManyToManyField(Task, blank=True)
    project_manager = models.ForeignKey(
        User, on_delete=models.CASCADE, default=1)
    created_at = models.DateTimeField(
        auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Company(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Team(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name='teams')
    members = models.ManyToManyField(
        User, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class TeamManager(models.Model):
    team = models.ForeignKey(
        Team, on_delete=models.CASCADE, related_name='managers')
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='managed_teams')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username}: {self.team}'


class Attachment(models.Model):
    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='attachments/')
