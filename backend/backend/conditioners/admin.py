from django.contrib import admin
from .models import Conditioner

# Register your models here.
# admin.site.register(Conditioner)

# Conditioner的自定义
class ConditionerAdmin(admin.ModelAdmin):
    list_display = ('room_number', 'temperature_now', 'temperature_set', 'mode', 'status')

admin.site.register(Conditioner, ConditionerAdmin)