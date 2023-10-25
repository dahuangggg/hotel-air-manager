from celery import shared_task
from .models import Conditioner


# 定义更新温度的任务
"""
1. 开空调
    1.1 低风速模式: 90s温度变化一度 0.1元/10s
    1.2 中风速模式: 60s温度变化一度 0.2元/10s
    1.3 高风速模式: 30s温度变化一度 0.3元/10s
    1.4 稳定时: 0.05元/10s
2. 关空调
    2.1 温度回升:假设室外温度为28度,当前温度低于室外温度时,温度会回升,每120s回升一度
"""
# 用shared_task装饰器装饰任务，使得celery可以自动发现并注册任务
@shared_task 
def update_temperature():
    # 从数据库中获取所有空调
    acs = Conditioner.objects.all()
    # 遍历空调
    for ac in acs:
        current_temperature = ac.temperature_now
        target_temperature = ac.temperature_set
        mode = ac.mode
        status = ac.status
        update_times = ac.update_times
        cost = ac.cost
        # 空调的状态为开机时
        if ac.status:
            # 当温度没有稳定时，根据模式更新温度
            if current_temperature > target_temperature:
                if mode == '低风速':
                    update_times -= 4
                    cost += 0.1
                elif mode == '中风速':
                    update_times -= 8
                    cost += 0.2
                elif mode == '高风速':
                    update_times -= 12
                    cost += 0.3
            if current_temperature < target_temperature:
                if mode == '低风速':
                    update_times += 4
                    cost += 0.1
                elif mode == '中风速':
                    update_times += 8
                    cost += 0.2
                elif mode == '高风速':
                    update_times += 12
                    cost += 0.3
            # 当温度稳定时，无论模式如何，费用都会增加0.05
            else:
                cost += 0.05
        else:
            # 当空调的状态为关机时，假设室温为28度，当前温度低于室温时温度会回升
            if current_temperature < 28:
                update_times += 3

        # 更新温度
        if update_times >= 36:
            update_times -= 36
            current_temperature += 1
        if update_times <= -36:
            update_times += 36
            current_temperature -= 1

        # 更新空调的状态
        ac.temperature_now = current_temperature
        ac.update_times = update_times
        ac.cost = cost
        ac.save()