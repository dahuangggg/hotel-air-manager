from django.db import models
from acounts.models import User

# Create your models here.

class Conditioner(models.Model):
    MODE_CHOICES = (
        ('0', '正常模式'),
        ('1', '节能模式'),
        ('2', '自动模式'),
    )
    # 当前温度
    temperature_now = models.IntegerField(blank=False, default=25)
    # 设置温度
    temperature_set = models.IntegerField(blank=False, default=25)
    # 模式(节能模式,正常模式,自动模式)
    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default='0')
    # 状态(开机,关机)
    status = models.BooleanField(default=False, blank=False)
    # 房间号(one to one)
    room_number = models.OneToOneField(User, on_delete=models.CASCADE)