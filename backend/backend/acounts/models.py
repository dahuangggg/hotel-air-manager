from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from account_group1.models import User_group1

# Create your models here.

class User(models.Model):
    name = models.CharField(max_length=20)
    # password为手机尾号后4位
    password = models.CharField(max_length=4)
    user_group1 = models.ForeignKey(User_group1, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name

# class Customer(models.Model):
#     name = models.CharField(max_length=20)
#     # 入住时间(精确到秒)
#     check_in_time = models.DateTimeField(auto_now_add=True)
#     # 结账时间
#     check_out_time = models.DateTimeField(auto_now_add=True)
