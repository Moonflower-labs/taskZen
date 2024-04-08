from django.contrib import admin
from tasks.models import *
# Register your models here.
admin.site.register(User)
admin.site.register(Task)
admin.site.register(Project)
admin.site.register(Company)
admin.site.register(Team)
admin.site.register(TeamManager)
admin.site.register(TaskReview)
admin.site.register(Role)
admin.site.register(Attachment)
admin.site.register(TaskComment)
