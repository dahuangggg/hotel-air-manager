from celery import shared_task
from .models import Conditioner
from setup.models import Settings
from django.db import transaction
from log.models import Log, Detail
from log.views import write_log, write_detail
from django.db.models import Case, When, Value, IntegerField
from django.db.models import F, ExpressionWrapper, DurationField, Q
from django.utils import timezone
from datetime import timedelta

MAX_RUNNING_CONDITIONERS = 3

# 定义更新温度的任务
"""
1. 开空调
    1.1 低风速模式: 180s温度变化一度 ->1元/度
    1.2 中风速模式: 120s温度变化一度 ->1.0元/度
    1.3 高风速模式: 60s温度变化一度 ->2.0元/度
    1.4 稳定时: 无收费
2. 关空调
    2.1 温度回升:假设室外温度为22度,当前温度高于室外温度时,温度会下降,每60s回升0.5度
"""

# 回温的逻辑,假设室温为22度,每120s回升一度
def update_temperature_back(ac, mode):
    if ac.temperature_now == 22:
        return
    # ZnVja3Us5rWL6K+V55So5L6L5YaZ55qE5LuA5LmI546p5oSP
    elif ac.temperature_now < 22 and mode == '制冷':
        ac.update_times += 3
    elif ac.temperature_now > 22 and mode == '制热':
        ac.update_times -= 3
    if ac.update_times >= 18:
        ac.update_times -= 18
        ac.temperature_now += 0.5
        # write_log('调度', '系统', ac, remark = '温度回升')
    if ac.update_times <= -18:
        ac.update_times += 18
        ac.temperature_now -= 0.5
        # write_log('调度', '系统', ac, remark = '温度回升')
    ac.save()

# 用shared_task装饰器装饰任务，使得celery可以自动发现并注册任务
@shared_task
def update_temperature():
    # 从数据库中获取设置
    try:
        setting = Settings.objects.get(id=1)
        setting_mode = setting.mode
        setting_status = setting.status
        setting_temperature_upper = setting.temperature_upper
        setting_temperature_lower = setting.temperature_lower
    except:
        setting_mode = '制热'
        setting_status = False
        setting_temperature_upper = 25
        setting_temperature_lower = 18
    # 从数据库中获取所有空调
    acs = Conditioner.objects.all()

    if setting_status == False or setting_mode == '检修':
        # 回温的逻辑,假设室温为22度,每60s回升0.5度
        for ac in acs:
            update_temperature_back(ac, setting_mode)
            
    # 遍历空调
    for ac in acs:
        # 空调的状态为开机时
        if ac.status == False:
            if (ac.queue_status!='无事可做'):
                write_log('调度', '系统', ac, remark = '空调已经关闭,服务结束')
                write_log('结束服务', '客户', ac, '空调已经关闭,服务结束')
                write_detail(ac)
                ac.queue_status = '无事可做'
                ac.save()
            update_temperature_back(ac, setting_mode)
            continue
        if ac.temperature_now >= ac.temperature_set and setting.mode == '制热':
            if ac.queue_status != '无事可做':
                write_log('调度', '系统', ac, remark = f'在制热模式下,当前温度{ac.temperature_now}°C 大于等于设置温度{ac.temperature_set}°C ,运行态转为闲置态')
                write_log('结束服务', '客户', ac)
                write_detail(ac)
                ac.queue_status = '无事可做'
                ac.save()
            # update_temperature_back(ac, setting_mode)
            continue
        if ac.temperature_now <= ac.temperature_set and setting.mode == '制冷':
            if ac.queue_status != '无事可做':
                write_log('调度', '系统', ac, remark = f'在制冷模式下,当前温度{ac.temperature_now}°C 小于等于设置温度{ac.temperature_set}°C ,运行态转为闲置态')
                write_log('结束服务', '客户', ac)
                write_detail(ac)
                ac.queue_status = '无事可做'
                ac.save()
            # update_temperature_back(ac)
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
            if update_times >= 18:
                update_times -= 18
                current_temperature += 0.5
                write_log('产生费用', '系统', ac, up = True)
                if current_temperature == target_temperature:
                    queue_status = '无事可做'
                    write_log('调度', '系统', ac, remark = f'当前温度{current_temperature}°C 等于设置温度{target_temperature}°C ,运行态转为闲置态')
                    write_log('结束服务', '客户', ac, f'温度已达标,当前温度' + str(current_temperature) + '°C,目标温度' + str(target_temperature) + '°C,当前模式' + str(ac.mode) + ',服务结束')
                    write_detail(ac)
                    check_and_update_conditioner_status()
                if mode == '低风速':
                    cost += setting.low_speed_fee * 0.5
                elif mode == '中风速':
                    cost += setting.mid_speed_fee * 0.5
                elif mode == '高风速':
                    cost += setting.high_speed_fee * 0.5
            if update_times <= -18:
                update_times += 18
                current_temperature -= 0.5
                write_log('产生费用', '系统', ac, up = False)
                if current_temperature == target_temperature:
                    queue_status = '无事可做'
                    write_log('调度', '系统', ac, remark = f'当前温度{current_temperature}°C 等于设置温度{target_temperature}°C ,运行态转为闲置态')
                    write_log('结束服务', '客户', ac, f'温度已达标,当前温度' + str(current_temperature) + '°C,目标温度' + str(target_temperature) + '°C,当前模式' + str(ac.mode) + ',服务结束')
                    write_detail(ac)
                    check_and_update_conditioner_status()
                if mode == '低风速':
                    cost += setting.low_speed_fee * 0.5
                elif mode == '中风速':
                    cost += setting.mid_speed_fee * 0.5
                elif mode == '高风速':
                    cost += setting.high_speed_fee * 0.5
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
        waiting_conditioners = Conditioner.objects.filter(queue_status='等待中')
        activeAc = Conditioner.objects.filter(queue_status__in=['运行中', '等待中'])
        if activeAc.count() <= MAX_RUNNING_CONDITIONERS:
            for ac in waiting_conditioners:
                ac.queue_status = '运行中'
                write_log('调度', '系统', ac, remark = '等待态转为运行态')
                ac.save()
        else:
            activeAc = activeAc.annotate(
                custom_order=Case(
                    When(mode='高风速', then=Value(1)),
                    When(mode='中风速', then=Value(2)),
                    When(mode='低风速', then=Value(3)),
                    default=Value(4),
                    output_field=IntegerField()
                ),
                time_diff=ExpressionWrapper(timezone.now() - F('queue_time'), output_field=DurationField())
            ).order_by('custom_order', '-time_diff')
            # 优先级的调度方式
            targe_mode = activeAc[2].mode # 可能发生时间片调度的mode
            if targe_mode == "高风速":
                for ac in activeAc.filter(mode="中风速"):
                    if ac.queue_status != "等待中":
                        ac.queue_status = "等待中"
                        write_log('调度', '系统', ac, remark = '运行态转为等待态')
                        ac.save()
                for ac in activeAc.filter(mode="低风速"):
                    if ac.queue_status != "等待中":
                        ac.queue_status = "等待中"
                        write_log('调度', '系统', ac, remark = '运行态转为等待态')
                        ac.save()
            if targe_mode == "中风速":
                for ac in activeAc.filter(mode="高风速"):
                    if ac.queue_status != "运行中":
                        # 将中风速的conditioner转为等待态
                        targe_ac = activeAc.filter(Q(mode="低风速") & Q(queue_status="运行中")).first()
                        if targe_ac:
                            targe_ac.queue_status = "等待中"
                            write_log('调度', '系统', targe_ac, remark = '运行态转为等待态')
                            targe_ac.save()
                        else:
                            targe_ac = activeAc.filter(Q(mode="中风速") & Q(queue_status="运行中")).first()
                            targe_ac.queue_status = "等待中"
                            write_log('调度', '系统', targe_ac, remark = '运行态转为等待态')
                            targe_ac.save()
                        ac.queue_status = "运行中"
                        write_log('调度', '系统', ac, remark = '等待态转为运行态')
                        ac.save()
                for ac in activeAc.filter(mode="低风速"):
                    if ac.queue_status != "等待中":
                        ac.queue_status = "等待中"
                        write_log('调度', '系统', ac, remark = '运行态转为等待态')
                        ac.save()
            elif targe_mode == "低风速":
                for ac in activeAc.filter(mode="中风速"):
                    if ac.queue_status != "运行中":
                        targe_ac = activeAc.filter(Q(mode="低风速") & Q(queue_status="运行中")).first()
                        targe_ac.queue_status = "等待中"
                        write_log('调度', '系统', targe_ac, remark = '运行态转为等待态')
                        targe_ac.save()
                        ac.queue_status = "运行中"
                        write_log('调度', '系统', ac, remark = '等待态转为运行态')
                        ac.save()
                for ac in activeAc.filter(mode="高风速"):
                    if ac.queue_status != "运行中":
                        targe_ac = activeAc.filter(Q(mode="低风速") & Q(queue_status="运行中")).first()
                        targe_ac.queue_status = "等待中"
                        write_log('调度', '系统', targe_ac, remark = '运行态转为等待态')
                        ac.queue_status = "运行中"
                        write_log('调度', '系统', ac, remark = '等待态转为运行态')
                        ac.save()

            # 时间片调度
            mode_running_conditioners = activeAc.filter(mode=targe_mode, queue_status='运行中')
            mode_waiting_conditioners = activeAc.filter(mode=targe_mode, queue_status='等待中')
            index = 0
            for ac in mode_waiting_conditioners:
                if timezone.now() - ac.queue_time >= timedelta(minutes=2):
                    conditioner_to_waiting = mode_running_conditioners[index]
                    index+=1
                    conditioner_to_waiting.queue_status = "等待中"
                    write_log('调度', '系统', conditioner_to_waiting, remark='运行态转为等待态')
                    conditioner_to_waiting.save()
                    ac.queue_status = "运行中"
                    write_log('调度', '系统', ac, remark = '等待态转为运行态')
                    ac.save()
                else:
                    break
        # for ac in Conditioner.objects.all():
        #     if ac.
        

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
            # 优先级的调度方式
            if conditioner.mode == '低风速':
                conditioner.queue_status = '等待中'
                write_log('请求服务', '客户', conditioner, '请求服务,等待队列已满, 先进入等待态')
                write_log('调度', '系统', conditioner, remark = '闲置态转为等待态')
            elif conditioner.mode == '中风速':
                # 判断运行态中是否有低风速的conditioner
                low_speed_conditioner = Conditioner.objects.filter(queue_status='运行中', mode='低风速').first()
                if low_speed_conditioner:
                    # 如果有低风速的conditioner,则将其设置为等待态
                    low_speed_conditioner.queue_status = '等待中'
                    write_log('调度', '系统', low_speed_conditioner, remark = '有中风速请求,低风速转为等待态')
                    low_speed_conditioner.save()
                    # 将当前conditioner设置为运行态
                    conditioner.queue_status = '运行中'
                    write_log('请求服务', '客户', conditioner, '请求服务,等待队列已满,由于当前风速为中风速,优先级较高,直接进入运行态')
                    write_log('调度', '系统', conditioner, remark = '闲置态转为运行态')
                else:
                    # 如果没有低风速的conditioner,则将其设置为等待态
                    conditioner.queue_status = '等待中'
                    write_log('请求服务', '客户', conditioner, '请求服务,等待队列已满,先进入等待态')
                    write_log('调度', '系统', conditioner, remark = '闲置态转为等待态')
            elif conditioner.mode == '高风速':
                # 判断运行态中是否有低风速和中风速的conditioner
                low_speed_conditioner = Conditioner.objects.filter(queue_status='运行中', mode='低风速').first()
                mid_speed_conditioner = Conditioner.objects.filter(queue_status='运行中', mode='中风速').first()
                if low_speed_conditioner:
                    # 如果有低风速的conditioner,则将其设置为等待态
                    low_speed_conditioner.queue_status = '等待中'
                    write_log('调度', '系统', low_speed_conditioner, remark = '有高风速请求,低风速转为等待态')
                    low_speed_conditioner.save()
                    # 将当前conditioner设置为运行态
                    conditioner.queue_status = '运行中'
                    write_log('请求服务', '客户', conditioner, '请求服务,等待队列已满,由于当前风速为高风速,优先级最高,直接进入运行态')
                    write_log('调度', '系统', conditioner, remark = '闲置态转为运行态')
                elif mid_speed_conditioner:
                    # 如果有中风速的conditioner,则将其设置为等待态
                    mid_spe.ed_conditioner.queue_status = '等待中'
                    write_log('调度', '系统', mid_speed_conditioner, remark = '有高风速请求,中风速转为等待态')
                    mid_speed_conditioner.save()
                    # 将当前conditioner设置为运行态
                    conditioner.queue_status = '运行中'
                    write_log('请求服务', '客户', conditioner, '请求服务,等待队列已满,由于当前风速为高风速,优先级较高,直接进入运行态')
                    write_log('调度', '系统', conditioner, remark = '闲置态转为运行态')
                else:
                    # 如果没有低风速和中风速的conditioner,则将其设置为等待态
                    conditioner.queue_status = '等待中'
                    write_log('请求服务', '客户', conditioner, '请求服务,等待队列已满,先进入等待态')
                    write_log('调度', '系统', conditioner, remark = '闲置态转为等待态')

        conditioner.save()
        # 检查并更新conditioner的状态
        check_and_update_conditioner_status()
