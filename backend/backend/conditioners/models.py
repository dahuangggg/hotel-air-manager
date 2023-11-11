from django.db import models
from acounts.models import User

# Create your models here.

class Conditioner(models.Model):
    MODE_CHOICES = (
        ('低风速', '低风速'),
        ('中风速', '中风速'),
        ('高风速', '高风速'),
    )
    STATUS_CHOICES = [
        ('运行中', '运行中'),
        ('等待中', '等待中'),
        ('无事可做', '无事可做'),
    ]
    # 当前温度
    temperature_now = models.IntegerField(blank=False, default=25)
    # 设置温度
    temperature_set = models.IntegerField(blank=False, default=25)
    # 模式(低,中,高)
    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default='0')
    # 状态(开机,关机)
    status = models.BooleanField(default=False, blank=False)
    # 房间号(one to one)
    room_number = models.OneToOneField(User, on_delete=models.CASCADE)
    # update次数
    update_times = models.IntegerField(blank=False, default=0)
    # 当前费用
    cost = models.FloatField(blank=False, default=0)
    # 累计费用
    total_cost = models.FloatField(blank=False, default=0)
    # 空调队列状态
    queue_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='无事可做')
