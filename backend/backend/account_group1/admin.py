from django.contrib import admin
# Register your models here.
from .models import User_group1

class User_group1_admin(admin.ModelAdmin):
    list_display = ('username', 'password', 'room_number', 'role', 'id_card', 'phone_number', 'token')

admin.site.register(User_group1)