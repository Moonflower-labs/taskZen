
import mimetypes


class UserSerializer:
    @staticmethod
    def serialize(user):
        serialized_user = {
            'id': user.id,
            'username': user.username,
            'company': user.company.name.title() if user.company else None,
            'teams': [{'id': team.id, 'name': team.name.title()} for team in user.teams.all()] if user.teams else None,
            'managed_teams': [{'id': managed_team.team.id, 'name': managed_team.team.name.title()} for managed_team in user.managed_teams.all()] if user.managed_teams else None,
            'roles': [role.get_name_display() for role in user.roles.all()],
            'pending_assignments': [TaskSerializer.serialize(task)for task in user.tasks_assigned.filter(status='pending')if task.visibility == 'public'],
            'pending_reviews': [TaskSerializer.serialize(task)for task in user.tasks_created.filter(status='reviewing')],
        }
        return serialized_user


class TeamSerializer:
    @staticmethod
    def serialize(team):
        serialized_user = {
            'id': team.id,
            'name': team.name,
            'description': team.description,
            'members': [UserSerializer.serialize(member) for member in team.members.all()],
            'managers': [UserSerializer.serialize(manager.user) for manager in team.managers.all()]
        }
        return serialized_user


class TaskSerializer:
    @staticmethod
    def serialize(task):
        serialized_task = {
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'due_date': task.due_date.strftime("%d-%m-%Y"),
            'status': task.status.title(),
            'priority': task.priority.title(),
            'visibility': task.visibility,
            'assigned_to': task.assigned_to.username if task.assigned_to else None,
            'created_by': task.created_by.username,
            'comments':  [{'id': comment.id, 'user': comment.user.username,
                           'task': comment.task.id,
                           'date': comment.date.strftime("%d-%m-%Y"),
                           'text': comment.text}for comment in task.comments.all()],
            'attachments': [
                {'id': attachment.id,
                    'url': attachment.file.url,
                    'content_type': mimetypes.guess_type(attachment.file.name)[0] if attachment.file.name else None
                 }
                for attachment in task.attachments.all()
            ]
        }
        return serialized_task


class TaskReviewSerializer:
    @staticmethod
    def serialize(review):
        serialized_review = {
            'id': review.id,
            'task': TaskSerializer.serialize(review.task),
            'reviewer': UserSerializer.serialize(review.reviewer),
            'status': review.get_status_display(),
            'comments': review.comments,
            'review_date': review.review_date.strftime("%d-%m-%Y"),
        }

        return serialized_review


class ProjectSerializer:
    @staticmethod
    def serialize(project):
        serialized_project = {
            'id': project.id,
            'title': project.title,
            'description': project.description,
        }
        if hasattr(project, 'project_manager'):
            serialized_project['project_manager'] = project.project_manager.username
        if hasattr(project, 'tasks'):
            serialized_project['tasks'] = [TaskSerializer.serialize(
                task) for task in project.tasks.all()]
        return serialized_project
