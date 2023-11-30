from django.contrib import admin
from .models import Log, Detail

# Register your models here.

class LogAdmin(admin.ModelAdmin):
    list_display = ('type', 'time', 'operator', 'object', 'remark')

class DetailAdmin(admin.ModelAdmin):
    list_display = ('room_number', 'request_duaration', 'start_time', 'end_time', 'service_duaration', 'speed', 'cost', 'total_cost', 'fee')

admin.site.register(Log)
admin.site.register(Detail)