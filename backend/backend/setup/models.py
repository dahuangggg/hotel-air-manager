from django.db import models

# Create your models here.

class Settings(models.Model):
    MODE_CHOICES = (
        ('制冷', '制冷'),
        ('制热', '制热'),
        ('检修', '检修'),
    )
    # 开关
    status = models.BooleanField(default=False, blank=False)
    # 温度上限
    # temperature_upper = ArrayField(models.IntegerField(),size=3,verbose_name="温度上限 (℃)", default=[24, 28, 30])
    temperature_upper = models.IntegerField(verbose_name="温度上限 (℃)", default=24)
    # 温度下限
    # temperature_lower = ArrayField(models.IntegerField(),size=3,verbose_name="温度下限 (℃)", default=[16, 22, 16])
    temperature_lower = models.IntegerField(verbose_name="温度下限 (℃)", default=16)
    # 模式
    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default='0')
    # 费率(低速风（0.5 元/1C°）、中速风（1 元/1C°）、高速风（2 元/1C°）)
    # speed_fees = ArrayField(models.FloatField(),size=3,verbose_name="风速费率 (元/1C°)", default=[0.5, 1, 2])
    low_speed_fee = models.FloatField(verbose_name="低速风费率 (元/1C°)", default=0.5)
    mid_speed_fee = models.FloatField(verbose_name="中速风费率 (元/1C°)", default=1)
    high_speed_fee = models.FloatField(verbose_name="高速风费率 (元/1C°)", default=2)