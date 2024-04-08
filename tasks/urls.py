from django.urls import path, re_path
from . import views

urlpatterns = [
    path("api/login", views.LoginView.as_view(), name="login"),
    path("api/logout", views.LogoutView.as_view(), name="logout"),
    path("api/register", views.RegisterView.as_view()),
    path('api/users', views.UserListView.as_view()),
    path('api/user/profile', views.UserDetail.as_view()),
    path('api/team/list', views.TeamListView.as_view()),
    path('api/team', views.TeamDetailView.as_view()),
    path('api/team/<int:teamId>', views.TeamDetailView.as_view()),
    path('api/dashboard', views.DashboardView.as_view()),
    path('api/task/list', views.TaskListView.as_view()),
    path('api/task/<int:taskId>', views.TaskDetailView.as_view()),
    path('api/task', views.TaskDetailView.as_view()),
    path('api/task/comments', views.TaskCommentView.as_view()),
    path('api/task/comments/<int:id>', views.TaskCommentView.as_view()),
    path('api/review', views.TaskReviewView.as_view()),
    path('api/review/<int:reviewId>', views.TaskReviewView.as_view()),
    path('api/review/list', views.TaskReviewList.as_view()),
    path('api/project/list', views.ProjectListView.as_view()),
    path('api/project/<int:projectId>', views.ProjectDetailView.as_view()),
    path('api/project', views.ProjectDetailView.as_view()),
    path('api/attachments/<int:id>', views.AttachmentView.as_view()),
    # URL pattern for your React view
    re_path(r'^(?!media/).*', views.ReactAppView.as_view()),
]
