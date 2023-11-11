from django.contrib import admin
from .models import Settings

# Settings的自定义
class SettingsAdmin(admin.ModelAdmin):
    list_display = ('temperature_upper', 'temperature_lower', 'mode', 'low_speed_fee', 'mid_speed_fee', 'high_speed_fee', 'status')

admin.site.register(Settings, SettingsAdmin)