from django.contrib import admin
from .models import User

# Register your models here.
# admin.site.register(User)

# User的自定义
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'password')

admin.site.register(User, UserAdmin)