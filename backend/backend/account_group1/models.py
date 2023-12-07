from django.db import models

# Create your models here.

class User_group1(models.Model):
    username = models.CharField(max_length=20)
    password = models.CharField(max_length=20)
    room_number = models.CharField(max_length=20, null=True, blank=True)
    role = models.CharField(max_length=20)
    id_card = models.CharField(max_length=20, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    token = models.CharField(max_length=1024, null=True, blank=True)

    def __str__(self):
        return self.role + self.username