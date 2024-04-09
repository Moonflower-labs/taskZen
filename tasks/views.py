import json
from django.core.paginator import Paginator
from datetime import datetime, timedelta
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views import View
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView

from .serializers import *
from .models import *


# This view serves the react app template
class ReactAppView(TemplateView):
    template_name = 'tasks/index.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(**kwargs)

        with open('./react/dist/.vite/manifest.json') as manifest_file:
            manifest_data = json.load(manifest_file)
            manifest_js = manifest_data['index.html']['file']
            manifest_css = manifest_data['index.html']['css']

        context['manifest_js'] = manifest_js
        context['manifest_css'] = manifest_css[0]
        return context


@method_decorator(login_required, name='dispatch')
class UserListView(View):
    def get(self, request):
        queryset = User.objects.all()
        data = [UserSerializer.serialize(user) for user in queryset]

        return JsonResponse(data, safe=False)


# This view returns the current user if logged in
class UserDetail(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'message': 'You are not logged in.'})
        user = get_object_or_404(User, pk=request.user.id)
        serialized_user = UserSerializer.serialize(user)

        return JsonResponse(serialized_user, safe=False)


#  DASHBOARD : This view sends the data needed for the dasboard page
# based on wether the request user is admin
@method_decorator(login_required, name='dispatch')
class DashboardView(View):
    def get(self, request):
        data = {}
        if request.user.has_manager_or_admin_role():
            #  4 latest projects
            projects = Project.objects.filter(
                project_manager=request.user).order_by('-created_at')[:4]
            serialized_projects = [ProjectSerializer.serialize(
                project)for project in projects]
            #  4 task most urgent due date in less than 3 days
            query = Task.objects.filter(
                created_by=request.user, due_date__gte=datetime.now().date(), due_date__lte=datetime.now() + timedelta(days=3)
            ).order_by('-created_at')[:4]

            urgent_tasks = [TaskSerializer.serialize(task) for task in query]

            completed_tasks_count = Task.objects.filter(
                status='complete', created_by=request.user).count()
            pending_tasks_count = Task.objects.filter(
                status='pending', created_by=request.user).count()
            # missed deadlines
            query_2 = Task.objects.filter(
                created_by=request.user, due_date__lte=datetime.now(), status='pending')[:4]
            missed_deadlines = [
                TaskSerializer.serialize(task) for task in query_2]
            missed_deadlines_count = Task.objects.filter(
                created_by=request.user, status='pending', due_date__lte=datetime.now()).count()
            all_tasks = Task.objects.filter(created_by=request.user)

        else:
            #  4 task most urgent tasks (due date in less than 3 days)
            query = Task.objects.filter(
                assigned_to=request.user, due_date__gte=datetime.now().date(), due_date__lte=datetime.now() + timedelta(days=3)
            ).order_by('-created_at')[:4]

            urgent_tasks = [TaskSerializer.serialize(task) for task in query]
            completed_tasks_count = Task.objects.filter(
                status='complete', assigned_to=request.user).count()
            pending_tasks_count = Task.objects.filter(
                status='pending', assigned_to=request.user).count()
            # missed deadlines
            query_2 = Task.objects.filter(
                assigned_to=request.user, due_date__lte=datetime.now(), status='pending')[:4]
            missed_deadlines = [
                TaskSerializer.serialize(task) for task in query_2]
            missed_deadlines_count = Task.objects.filter(
                assigned_to=request.user, status='pending', due_date__lte=datetime.now()).count()
            all_tasks = Task.objects.filter(assigned_to=request.user)
            serialized_projects = None

        data = {
            'projects': serialized_projects,
            'completed_tasks_count': completed_tasks_count,
            'missed_deadlines_count': missed_deadlines_count,
            'pending_tasks_count': pending_tasks_count,
            'urgent_tasks': urgent_tasks,
            'missed_deadlines': missed_deadlines,
            'tasks': [TaskSerializer.serialize(task) for task in all_tasks],
            'all_tasks_count': all_tasks.count(),
        }

        return JsonResponse(data, safe=False)


#          TEAMS
@method_decorator(login_required, name='dispatch')
class TeamListView(View):
    def get(self, request):
        # all company teams
        teams = Team.objects.filter(company=request.user.company)
        teams_q = request.GET.get('teams')
        if teams_q == 'managed':
            # managed teams
            teams = teams.filter(managers__user=request.user)
        if teams_q == 'myTeams':
            teams = teams.filter(members=request.user)

        serialized_teams = [TeamSerializer.serialize(
            team)for team in teams]

        page = request.GET.get('page', 1)
        paginator = Paginator(serialized_teams, 5)
        page_obj = paginator.get_page(page)

        employees = User.objects.filter(company=request.user.company)
        serialized_employees = [
            UserSerializer.serialize(user)for user in employees]

        data = {
            'teams': page_obj.object_list,
            'employees': serialized_employees,
            'totalPages': paginator.num_pages,
        }

        return JsonResponse(data, safe=False)


#        TEAM CRUD
@method_decorator(login_required, name='dispatch')
class TeamDetailView(View):
    def get(self, request, teamId):
        team = get_object_or_404(Team, id=teamId)
        employee_list = User.objects.filter(company=request.user.company)
        employees = [UserSerializer.serialize(user)for user in employee_list]
        data = {
            'team': TeamSerializer.serialize(team),
            'employees': employees,
        }

        return JsonResponse(data, safe=False)

    def post(self, request):  # Create a new team
        name = request.POST.get('name')
        description = request.POST.get('description')
        members = request.POST.getlist('employees')
        company = request.user.company

        try:
            newTeam = Team(name=name, description=description, company=company)
            newTeam.save()
            members_to_add = User.objects.filter(id__in=members)
            for member in members_to_add:
                newTeam.members.add(member)
                member.teams.add(newTeam)
                # Create de manager object
            teamManager = TeamManager(team=newTeam, user=request.user)
            teamManager.save()
            return JsonResponse({'message': 'Team created successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'An error has ocurred {e}'})

    def put(self, request, teamId):  # edit a task
        team = get_object_or_404(Team, pk=teamId)
        managed_teams = Team.objects.filter(managers__user=request.user)
        # Ensure user is team manager!
        if team not in managed_teams:
            return JsonResponse({'error': 'Unauthorized action.'})
        # Get the new data from the form if exists
        body = request.body
        data = json.loads(body)
        member_ids = data.get('employees')
        # convert to integers
        member_ids_int = [int(tid) for tid in member_ids]
        selected_members = User.objects.filter(id__in=member_ids_int)
        team.members.set(selected_members)
        # Update fields if present in the request data
        team.name = data.get('name', team.name)
        team.description = data.get('description', team.description)
        team.save()

        return JsonResponse({'message': 'Team updated successfully'}, status=200)

    def delete(self, request, teamId):  # Delete a task
        team = get_object_or_404(Team, pk=teamId)
        managed_teams = Team.objects.filter(managers__user=request.user)
        # Ensure user is team manager!
        if team not in managed_teams:
            return JsonResponse({'error': 'Unauthorized action.'})

        team.delete()
        return JsonResponse({'message': 'Task deleted successfully.'})


#    TASKS
@method_decorator(login_required, name='dispatch')
class TaskListView(View):
    def get(self, request):
        priority = request.GET.get('priority')
        q = request.GET.get('q', '')
        tasks_q = request.GET.get('tasks')
        visibility = request.GET.get('visibility')
        status = request.GET.get('status')
        user_company = request.user.company
        all_tasks = Task.objects.filter(company=user_company)
        # All tasks associated to the user company
        queryset = all_tasks
        if tasks_q == 'missed':
            queryset = queryset.filter(
                due_date__lte=datetime.now(), status='pending')

        if tasks_q == 'created' or not tasks_q and request.user.has_manager_or_admin_role():
            queryset = Task.objects.filter(created_by=request.user)
        if tasks_q == 'assigned' or not tasks_q and not request.user.has_manager_or_admin_role():
            queryset = Task.objects.filter(assigned_to=request.user)
        if visibility:
            queryset = queryset.filter(visibility=visibility)
        if status in ['pending', 'complete', 'reviewing']:
            queryset = queryset.filter(status=status)
        if priority in ['high', 'medium', 'low']:
            queryset = queryset.filter(priority=priority)
        # If user not admin send only public tasks
        if not request.user.has_manager_or_admin_role():
            queryset = queryset.filter(visibility='public')
        # Apply query filter
        queryset = queryset.filter(title__icontains=q)
        # Order results
        queryset = queryset.order_by('-created_at')

        data = [TaskSerializer.serialize(task)for task in queryset]
        page = request.GET.get('page', 1)
        paginator = Paginator(data, 5)
        page_obj = paginator.get_page(page)

        employee_list = User.objects.filter(company=request.user.company)
        employees = [UserSerializer.serialize(user)for user in employee_list]
        data_ = {
            'tasks': page_obj.object_list,
            'totalPages': paginator.num_pages,
            'employees': employees,
        }

        return JsonResponse(data_, safe=False)


#    TASK CRUD
@method_decorator(login_required, name='dispatch')
class TaskDetailView(View):
    def get(self, request, taskId):
        task = get_object_or_404(Task, id=taskId)
        employee_list = User.objects.filter(company=request.user.company)
        employees = [UserSerializer.serialize(user)for user in employee_list]

        data = {
            'task': TaskSerializer.serialize(task),
            'employees': employees,
        }

        return JsonResponse(data, safe=False)

    def post(self, request):  # Create a new task
        title = request.POST.get('title')
        description = request.POST.get('description')
        due_date = request.POST.get('due_date')
        priority = request.POST.get('priority')
        visibility = request.POST.get('visibility')
        created_by = request.user
        assign_to_id = request.POST.get('assign_to')
        assignee = User.objects.get(
            pk=int(assign_to_id)) if assign_to_id else None
        company = request.user.company
        try:
            newTask = Task(title=title, description=description, due_date=due_date,
                           priority=priority, visibility=visibility, created_by=created_by, assigned_to=assignee, company=company)
            newTask.save()
            return JsonResponse({'message': 'Task created successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'An error has ocurred {e}'})

    def put(self, request, taskId):  # edit a task
        task = get_object_or_404(Task, pk=taskId)
        # Ensure user is Author!
        if task.created_by != request.user:
            return JsonResponse({'error': 'Unauthorized action.'})
        # Get the new data from the form if exists
        body = request.body
        data = json.loads(body)
        # Update fields if present in the request data
        task.title = data.get('title', task.title)
        task.description = data.get('description', task.description)
        task.due_date = data.get('due_date', task.due_date)
        task.priority = data.get('priority', task.priority)
        task.visibility = data.get('visibility', task.visibility)
        assign_to_id = data.get('assign_to')
        assignee = User.objects.get(
            pk=int(assign_to_id)) if assign_to_id else None
        task.assigned_to = assignee

        task.save()

        return JsonResponse({'message': 'Task updated successfully'}, status=200)

    def patch(self, request, taskId):  # Mark task as complete/set for review
        body = request.body
        data = json.loads(body)
        task = get_object_or_404(Task, pk=taskId)
        status = data.get('status')
        visibility = data.get('visibility')
        if status:
            if status == 'reviewing' and request.user == task.assigned_to:
                task.status = status
            else:
                if not request.user.has_manager_or_admin_role():
                    return JsonResponse({'error': 'Unauthorized action.'})
                task.status = status
        if visibility:
            task.visibility = 'public' if visibility == 'true' else 'private'

        task.save()

        return JsonResponse({'message': f'Task status updated to {task.status}'}, status=200)

    def delete(self, request, taskId):  # Delete a task
        task = get_object_or_404(Task, pk=taskId)
        # Ensure user is Author!
        if task.created_by != request.user:
            return JsonResponse({'error': 'Unauthorized action.'})

        task.delete()
        return JsonResponse({'message': 'Task deleted successfully.'})


@method_decorator(login_required, name='dispatch')
class TaskReviewList(View):
    def get(self, request):
        data = {}
        if request.user.has_manager_or_admin_role():
            # If user is admin return Reviews created and tasks for review
            queryset = TaskReview.objects.filter(
                reviewer=request.user).order_by('-review_date')
            tasks_for_review = Task.objects.filter(
                status='reviewing', created_by=request.user)
            serialized_tasks = [TaskSerializer.serialize(
                task)for task in tasks_for_review]

        else:
            # If user is employee , return reviews related to the user assigned tasks
            tasks = request.user.tasks_assigned.all()
            serialized_tasks = [
                TaskSerializer.serialize(task)for task in tasks]
            queryset = TaskReview.objects.filter(task__in=tasks)

        reviews = [TaskReviewSerializer.serialize(
            review)for review in queryset]
        page = request.GET.get('page', 1)
        paginator = Paginator(reviews, 5)
        page_obj = paginator.get_page(page)
        data = {
            'reviews': page_obj.object_list,
            'totalPages': paginator.num_pages,
            'tasks': serialized_tasks,
        }

        return JsonResponse(data, safe=False)


@method_decorator(login_required, name='dispatch')
class TaskReviewView(View):
    def get(self, request, reviewId):
        review = get_object_or_404(TaskReview, pk=reviewId)
        if request.GET.get('tasks') and request.user.has_manager_or_admin_role():
            tasks = Task.objects.filter(created_by=request.user)
            data = {
                'review': TaskReviewSerializer.serialize(review),
                'tasks': [TaskSerializer.serialize(task)for task in tasks]
            }

            return JsonResponse(data,  safe=False, status=200)

        return JsonResponse(TaskReviewSerializer.serialize(review), status=200)

    def post(self, request):
        comments = request.POST.get('comments')
        status = request.POST.get('status')
        task_id = request.POST.get('taskId')
        task = get_object_or_404(Task, pk=int(task_id))
        try:
            newReview = TaskReview(task=task, comments=comments,
                                   reviewer=request.user, status=status)
            newReview.save()
            task.status = 'complete' if status == 'approved' else 'pending'
            task.save()
            return JsonResponse({'message': 'Task review created successfully.'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'An error has ocurred {e}'})

    def put(self, request, reviewId):
        review = get_object_or_404(TaskReview, pk=reviewId)
        # Ensure user is Author!
        if review.reviewer != request.user:
            return JsonResponse({'error': 'Unauthorized action.'})
        # Get the new data from the form if exists
        body = request.body
        data = json.loads(body)
        # Update fields if present in the request data
        review.comments = data.get('comments', review.comments)
        taskId = data.get('task', review.task)
        review.status = data.get('status', review.status)
        task_reviewed = Task.objects.get(
            pk=int(taskId))

        review.task = task_reviewed
        review.save()
        # Update task status accordingly
        task_reviewed.status = 'complete' if review.status == 'approved' else 'pending'
        task_reviewed.save()

        return JsonResponse({'message': 'Task updated successfully'}, status=200)

    def delete(self, request, reviewId):
        review = get_object_or_404(TaskReview, pk=reviewId)
        # Ensure user permissions!
        if not request.user.has_manager_or_admin_role() or review.reviewer != request.user:
            return JsonResponse({'error': 'Unauthorized action.'})

        review.delete()
        return JsonResponse({'message': 'Review deleted successfully.'})


class AttachmentView(View):
    def post(self, request, id):
        attachments = request.FILES.getlist('attachments')
        task = Task.objects.get(pk=id)

        for attachment in attachments:
            new_attachment = Attachment(task=task, file=attachment)
            new_attachment.save()
        return JsonResponse({'message': 'Attachments saved successfully.'})

    def delete(self, request, id):
        attachment = get_object_or_404(Attachment, pk=id)
        attachment.delete()
        return JsonResponse({'message': 'Attachment deleted.'})


class TaskCommentView(View):
    def post(self, request):
        text = request.POST.get('text')
        taskId = request.POST.get('id')
        task = Task.objects.get(pk=taskId)

        new_comment = TaskComment(task=task, text=text, user=request.user)
        new_comment.save()
        return JsonResponse({'message': 'Comment saved successfully.'})

    def delete(self, request, id):
        comment = get_object_or_404(TaskComment, pk=id)
        comment.delete()
        return JsonResponse({'message': 'Comment deleted.'})


class ManagerAdminRequiredMixin:
    def dispatch(self, request, *args, **kwargs):
        if not request.user.has_manager_or_admin_role():
            return JsonResponse({'error': 'Unauthorized action.'})
        return super().dispatch(request, *args, **kwargs)


#       PROJECTS
@method_decorator(login_required, name='dispatch')
class ProjectListView(ManagerAdminRequiredMixin, View):
    def get(self, request):
        queryset = Project.objects.filter(
            project_manager=request.user).order_by('-created_at')
        serialized_projects = [ProjectSerializer.serialize(
            project) for project in queryset]
        page = request.GET.get('page', 1)
        paginator = Paginator(serialized_projects, 5)
        page_obj = paginator.get_page(page)
        # Aditionally send a list of all tasks availiable to add to projects
        task_list = list(Task.objects.filter(
            created_by=request.user).values('id', 'title'))

        data = {
            'projects': page_obj.object_list,
            'totalPages': paginator.num_pages,
            'taskList': task_list,
        }

        return JsonResponse(data, safe=False)


#      GET, CREATE, EDIT and DELETE a Project
@method_decorator(login_required, name='dispatch')
class ProjectDetailView(ManagerAdminRequiredMixin, View):
    def get(self, request, projectId):

        project = get_object_or_404(Project, id=projectId)
        serialized_project = ProjectSerializer.serialize(project)
        if request.GET.get('taskslist') == 'true':
         # Aditionally send a list of all tasks availiable to add to projects
            task_list = list(Task.objects.filter(
                created_by=request.user).values('id', 'title'))

            data = {
                'project': serialized_project,
                'taskList': task_list,
            }
            return JsonResponse(data, safe=False)
        else:

            return JsonResponse(serialized_project, safe=False)

    def post(self, request):  # Create a new Project
        title = request.POST.get('title')
        description = request.POST.get('description', '')
        project_manager = request.user
        task_ids = request.POST.getlist('tasks')
        try:
            newProject = Project(title=title, description=description,
                                 project_manager=project_manager)
            newProject.save()
            tasks_to_add = Task.objects.filter(id__in=task_ids)
            for task in tasks_to_add:
                newProject.tasks.add(task)

            return JsonResponse({'message': 'Project created successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'An error has ocurred {e}'})

    def put(self, request, projectId):  # Edit a Project
        project = get_object_or_404(Project, pk=projectId)
        # Ensure user is Author!
        if project.project_manager != request.user:
            return JsonResponse({'error': 'Unauthorized action.'})

        body = request.body
        data = json.loads(body)
        tasks = data.get('tasks')
        task_ids_int = [int(tid) for tid in tasks]
        # Retrieve the corresponding task instances based on the IDs
        selected_tasks = Task.objects.filter(id__in=task_ids_int)
        # Update the project instance with the selected tasks
        project.title = data.get('title', project.title)
        project.description = data.get('description', project.description)
        # Replace existing tasks with the selected ones
        project.tasks.set(selected_tasks)
        project.save()

        return JsonResponse({'message': 'Project edited successfully'}, status=200)

    def delete(self, request, projectId):  # Delete a Project
        project = get_object_or_404(Project, pk=projectId)
        # Ensure user is Author!
        if project.project_manager != request.user:
            return JsonResponse({'error': 'Unauthorized action.'})
        project.delete()
        return JsonResponse({'message': 'Project deleted successfully'})


########################### AUTHENTICATION ###################################
@method_decorator(ensure_csrf_cookie, name='dispatch')
class LoginView(View):
    def get(self, request):

        return JsonResponse({'message': 'CSRF token cookie is set'}, status=200)

    def post(self, request):
        username = request.POST["username"]
        password = request.POST["password"]

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            response = JsonResponse(
                {'message': 'Login successful', 'user': UserSerializer.serialize(user)}, status=200)

            return response
        else:
            return JsonResponse({'error': 'Invalid username and/or password'})


class LogoutView(View):
    def dispatch(self, request, *args, **kwargs):
        logout(request)

        return JsonResponse({'message': 'Logout successful'}, status=200)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class RegisterView(View):
    def post(self, request):
        username = request.POST.get("username")
        email = request.POST.get("email")
        # Ensure password matches confirmation
        password = request.POST.get("password")
        confirmation = request.POST.get("confirmation")
        company_name = request.POST.get("company")
        if password != confirmation:
            return JsonResponse({"error":  "Passwords must match."})
        # Attempt to create new user
        try:
            company, created = Company.objects.get_or_create(name=company_name)
            role_field = request.POST.get('role', 'Employee')
            role, created = Role.objects.get_or_create(name=role_field)

            user = User.objects.create_user(
                username, email, password, company=company)
            user.roles.add(role)
            user.save()
        except IntegrityError:
            return JsonResponse({"error": "Username already taken."})

        return JsonResponse({'message': 'Sign up successful'}, status=200)
