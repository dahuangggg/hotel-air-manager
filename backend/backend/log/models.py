from django.db import models
from conditioners.models import Conditioner

# Create your models here.

class Log(models.Model):
    TYPE_CHOICES = (
        ('入住', '入住'),
        ('结算', '结算'),
        ('开关机', '开关机'), #done
        ('调温', '调温'), #done
        ('调风', '调风'), #done
        ('请求服务', '请求服务'), #done
        ('结束服务', '结束服务'), #done
        ('调度', '调度'), #done
        ('产生费用', '产生费用'),
        ('请求详单', '请求详单')
    )
    USER_TYPE_CHOICES = (
        ('客户', '客户'),
        ('管理员', '管理员'),
        ('系统', '系统'),
    )
    # 操作类型
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='0')
    # 操作时间
    time = models.DateTimeField(auto_now_add=True)
    # 操作人
    operator = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='0')
    # 操作对象
    object = models.ForeignKey(Conditioner, on_delete=models.CASCADE)
    # 备注
    remark = models.CharField(max_length=1024, default='无')