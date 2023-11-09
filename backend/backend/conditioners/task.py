from celery import shared_task
from .models import Conditioner
from setup.models import Settings
from django.db import transaction
from log.models import Log

MAX_RUNNING_CONDITIONERS = 3

# 定义更新温度的任务
"""
1. 开空调
    1.1 低风速模式: 90s温度变化一度 0.5元/10s ->0.5元/度
    1.2 中风速模式: 60s温度变化一度 0.2元/10s ->1.0元/度
    1.3 高风速模式: 30s温度变化一度 0.3元/10s ->2.0元/度
    1.4 稳定时: 0.05元/10s
2. 关空调
    2.1 温度回升:假设室外温度为28度,当前温度低于室外温度时,温度会回升,每120s回升一度
"""

# 用shared_task装饰器装饰任务，使得celery可以自动发现并注册任务
@shared_task 
def update_temperature():
    # 从数据库中获取设置
    setting = Settings.objects.get(id=1)
    setting_mode = setting.mode
    setting_status = setting.status
    setting_temperature_upper = setting.temperature_upper
    setting_temperature_lower = setting.temperature_lower
    # 从数据库中获取所有空调
    acs = Conditioner.objects.all()

    if setting_status == False or setting_mode == '检修':
        return

    # 遍历空调
    for ac in acs:
        # 空调的状态为开机时
        if ac.status == False:
            if ac.queue_status != '无事可做':
                write_log('调度', '系统', ac, remark = '空调已经关闭,服务结束')
                write_log('结束服务', '客户', ac, '空调已经关闭,服务结束')
                ac.queue_status = '无事可做'
                ac.save()
            continue
        if ac.temperature_now >= ac.temperature_set and setting.mode == '制热':
            if ac.queue_status != '无事可做':
                write_log('调度', '系统', ac, remark = f'在制热模式下,当前温度{ac.temperature_now}°C 大于等于设置温度{ac.temperature_set}°C ,服务结束')
                write_log('结束服务', '客户', ac)
                ac.queue_status = '无事可做'
                ac.save()
            continue
        if ac.temperature_now <= ac.temperature_set and setting.mode == '制冷':
            if ac.queue_status != '无事可做':
                write_log('调度', '系统', ac, remark = f'在制冷模式下,当前温度{ac.temperature_now}°C 小于等于设置温度{ac.temperature_set}°C ,运行态转为闲置态')
                write_log('结束服务', '客户', ac)
                ac.queue_status = '无事可做'
                ac.save()
            continue
        if ac.queue_status == '运行中':
            current_temperature = ac.temperature_now
            target_temperature = ac.temperature_set
            mode = ac.mode
            status = ac.status
            update_times = ac.update_times
            cost = ac.cost
            queue_status = ac.queue_status

            # 当温度没有稳定时，根据模式更新温度
            if current_temperature > target_temperature:
                if mode == '低风速':
                    update_times -= 4
                elif mode == '中风速':
                    update_times -= 8
                elif mode == '高风速':
                    update_times -= 12
            if current_temperature < target_temperature:
                if mode == '低风速':
                    update_times += 4
                elif mode == '中风速':
                    update_times += 8
                elif mode == '高风速':
                    update_times += 12
            # 更新温度
            if update_times >= 36:
                update_times -= 36
                current_temperature += 1
                if current_temperature == target_temperature:
                    queue_status = '无事可做'
                    write_log('调度', '系统', ac, remark = f'当前温度{ac.temperature_now}°C 等于设置温度{ac.temperature_set}°C ,运行态转为闲置态')
                    write_log('结束服务', '客户', ac)
                    check_and_update_conditioner_status()
                if mode == '低风速':
                    cost += setting.low_speed_fee
                    log_entry = Log(type = '产生费用', operator = '系统', object = ac)
                elif mode == '中风速':
                    cost += setting.mid_speed_fee
                elif mode == '高风速':
                    cost += setting.high_speed_fee
                write_log('产生费用', '系统', ac, up = True)
            if update_times <= -36:
                update_times += 36
                current_temperature -= 1
                if current_temperature == target_temperature:
                    queue_status = '无事可做'
                    write_log('调度', '系统', ac, remark = f'当前温度{ac.temperature_now}°C 等于设置温度{ac.temperature_set}°C ,运行态转为闲置态')
                    write_log('结束服务', '客户', ac)
                    check_and_update_conditioner_status()
                if mode == '低风速':
                    cost += setting.low_speed_fee
                elif mode == '中风速':
                    cost += setting.mid_speed_fee
                elif mode == '高风速':
                    cost += setting.high_speed_fee
                write_log('产生费用', '系统', ac, up = False)
            # 更新空调的状态
            ac.temperature_now = current_temperature
            ac.update_times = update_times
            ac.cost = cost
            ac.queue_status = queue_status
            ac.save()


# 定义更新空调队列状态的任务,可以理解为等待态到运行态的任务会被自动完成
@shared_task
def check_and_update_conditioner_status():
    # 确保该代码块内的数据库操作要么完全成功，要么完全失败
    with transaction.atomic():
        running_conditioners = Conditioner.objects.filter(queue_status='运行中')
        if running_conditioners.count() < MAX_RUNNING_CONDITIONERS:
            # 如果运行态低于3个，尝试从等待队列中取出一个conditioner设置为运行态
            # 先进先出的调度方式
            waiting_conditioner = Conditioner.objects.select_for_update().filter(queue_status='等待中').first()
            if waiting_conditioner:
                write_log('调度', '系统', waiting_conditioner, remark = '等待态转为运行态')
                waiting_conditioner.queue_status = '运行中'
                waiting_conditioner.save()

# 请求id为conditioner_id的conditioner加入运行态
def request_conditioner_run(conditioner_id):
    with transaction.atomic():
        conditioner = Conditioner.objects.select_for_update().get(id=conditioner_id)
        running_conditioners_count = Conditioner.objects.filter(queue_status='运行中').count()
        if running_conditioners_count < MAX_RUNNING_CONDITIONERS:
            # 如果当前运行的conditioner少于3个，可以直接设置为运行态
            conditioner.queue_status = '运行中'
            write_log('请求服务', '客户', conditioner, '请求服务,等待队列未满,直接进入运行态')
            write_log('调度', '系统', conditioner, remark = '闲置态转为运行态')
        else:
            # 否则设置为等待态
            conditioner.queue_status = '等待中'
            write_log('请求服务', '客户', conditioner, '请求服务,等待队列已满, 先进入等待态')
            write_log('调度', '系统', conditioner, remark = '闲置态转为等待态')
        conditioner.save()
        # 检查并更新conditioner的状态
        check_and_update_conditioner_status()
