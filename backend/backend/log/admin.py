from django.contrib import admin
from .models import Log

# Register your models here.

class LogAdmin(admin.ModelAdmin):
    list_display = ('type', 'time', 'operator', 'object', 'remark')

admin.site.register(Log)