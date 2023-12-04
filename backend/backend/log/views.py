from setup.models import Settings
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from conditioners.models import Conditioner
from datetime import timedelta, datetime
from django.utils import timezone
from acounts.models import User
from conditioners.models import Conditioner
from django.utils.dateparse import parse_datetime
from setup.models import Settings
from .models import Log, Detail

# Create your views here.

def write_log(type, operator, ac, remark='无', request=None, up = True):
    if type == '开关机':
        log_entry = Log(
            type=type,
            operator=operator,
            object=ac,
            remark = '关机' if ac.status else '开机'
        )
        log_entry.save()
    elif type == '调温':
        log_entry = Log(
            type=type,  
            operator=operator,
            object=ac,
            remark = '温度从' + str(ac.temperature_set) + '°C调整到' + str(request.data['targetTemperature']) + '°C'
        )
        log_entry.save()
    elif type == '调风':
        log_entry = Log(
            type=type,
            operator=operator,
            object=ac,
            remark = '从' + str(ac.mode) + '调整到' + str(request.data['acMode'])
        )
        log_entry.save()
    elif type == '请求服务':
        log_entry = Log(
            type=type,
            operator=operator,
            object=ac,
            remark = remark
        )
        log_entry.save()
    elif type == '结束服务':
        if remark == '无':
            log_entry = Log(
                type=type,
                operator=operator,
                object=ac,
                remark = f'温度已达标,当前温度' + str(ac.temperature_now) + '°C,目标温度' + str(ac.temperature_set) + '°C,当前模式' + str(ac.mode) + ',服务结束'
            )
        else:
            log_entry = Log(
                type=type,
                operator=operator,
                object=ac,
                remark = remark
            )
        log_entry.save()
    elif type == '调度':
        log_entry = Log(
            type=type,
            operator=operator,
            object=ac,
            remark = remark
        )
        log_entry.save()
        # 每次调度后更新队列时间
        ac.queue_time = timezone.now()
        ac.save()
    elif type == '产生费用':
        setting = Settings.objects.get(id=1)
        if ac.mode == '低风速':
            fee = setting.low_speed_fee * 0.5
        elif ac.mode == '中风速':
            fee = setting.mid_speed_fee * 0.5
        elif ac.mode == '高风速':
            fee = setting.high_speed_fee * 0.5
        if up:
            log_entry = Log(
                type=type,
                operator=operator,
                object=ac,
                remark = f'温度从{ac.temperature_now} °C升高到{ac.temperature_now+0.5} °C,当前风速为{ac.mode},对应费率为{fee*2}元/1°C,产生费用{fee}元,费用从{round(ac.cost, 2)}元增加到{round(ac.cost + fee, 2)}元'
            )
        else:
            log_entry = Log(
                type=type,
                operator=operator,
                object=ac,
                remark = f'温度从{ac.temperature_now} °C降低到{ac.temperature_now-0.5} °C,当前风速为{ac.mode},对应费率为{fee*2}元/1°C,产生费用{fee}元,费用从{round(ac.cost, 2)}元增加到{round(ac.cost + fee, 2)}元'
            )
        log_entry.save()
    elif type == '入住':
        log_entry = Log(
            type=type,
            operator=operator,
            object=ac,
            remark = remark
        )
        log_entry.save()
    elif type == '结算':
        log_entry = Log(
            type=type,
            operator=operator,
            object=ac,
            remark = remark
        )
        log_entry.save()

def write_detail(ac):
    # 获取与当前conditioner相关的请求服务的Log对象,取最新的一个
    request_log = Log.objects.filter(object=ac, type='请求服务').order_by('-time').first()
    # 房间号
    name = ac.room_number.name
    # 开始时间
    start_time = request_log.time
    # 结束时间
    end_time = Log.objects.filter(object=ac, type='结束服务', time__gt=request_log.time).first().time
    # 请求时长
    request_time = end_time - start_time
    logs_after_request = Log.objects.filter(
        Q(object=ac) & Q(time__gte=request_log.time)
    ).order_by('time')
    # 服务时间要根据type=调度的log来计算
    # 查找time在log到end_service_log之间的调度log
    dispatch_logs = Log.objects.filter(
        Q(object=ac) & Q(time__gt=request_log.time) & Q(time__lt=end_time) & Q(type='调度')
    ).order_by('time')

    # 服务时长
    server_time = timedelta()
    # 服务时间的总和
    for dispatch_log in dispatch_logs:
        # 如果最后3个字为运行态
        if dispatch_log.remark[-3:] == '运行态':
            # 将log.time转换为具有相同时区信息的datetime对象
            log_time_with_timezone = dispatch_log.time.replace(tzinfo=timezone.get_current_timezone())

            # 结束运行态的时间为下一个调度log的时间
            next_dispatch_log = dispatch_logs.filter(time__gt=dispatch_log.time).first()
            if next_dispatch_log:
                end_time_with_timezone = next_dispatch_log.time.replace(tzinfo=timezone.get_current_timezone())
            else:
                end_time_with_timezone = timezone.now()
            
            # 使用具有相同时区信息的时间进行计算
            server_time += end_time_with_timezone - log_time_with_timezone
    # 风速
    mode = ac.mode
    # 当前费用
    log_entry = Log.objects.filter(
        Q(object=ac) & Q(type='产生费用') & Q(time__gt=request_log.time) & Q(time__lt=end_time)
    ).order_by('time')
    if log_entry:
        # 解析remark字段以提取费用信息
        cost = 0
        for log in log_entry:
            print(log.remark)
            parts = log.remark.split(',')
            for part in parts:
                if '产生费用' in part:
                    fee_str = part.strip('产生费用元').split(' ')[-1]
                    fee = float(fee_str)
                    cost += fee
    else:
        cost = 0
    # 累计费用
    total_cost = ac.cost
    # 费率
    setting = Settings.objects.get(id=1)
    if mode == '低风速':
        fee = setting.low_speed_fee
    elif mode == '高风速':
        fee = setting.high_speed_fee
    else:
        fee = setting.mid_speed_fee
    # 写入detail
    detail_entry = Detail(
        room_number = name,
        request_duaration = request_time.total_seconds(),
        start_time = start_time,
        end_time = end_time,
        service_duaration = server_time.total_seconds(),
        speed = mode,
        cost = cost,
        fee = fee,
    )
    detail_entry.save()

class getAcInfo(APIView):
    def post(self, request):
        try:
            start_time = request.data['start_time'] # 输出为string类型: 2023-11-21 00:00:00
            end_time = request.data['end_time'] # 输出为string类型: 2023-11-22 15:45:32
            print(start_time, end_time)
            if start_time == 'init' or end_time == 'init':
                Logs = Log.objects.all()
            else:
                # 转换字符串日期为datetime对象
                start_datetime = parse_datetime(start_time)
                end_datetime = parse_datetime(end_time)

                # 使用 Q 对象来构建复杂查询
                Logs = Log.objects.filter(
                    Q(time__gte=start_datetime) & Q(time__lte=end_datetime)
                )
            conditioners = Conditioner.objects.all().order_by('room_number')
            detail = {}
            for conditioner in conditioners:
                detail[conditioner.room_number.name] = {
                    'roomNumber': conditioner.room_number.name,
                    # 开关次数
                    'on_off_times': 0,
                    # 调度次数
                    'dispatch_times': 0,
                    # 详单条数
                    'detail_times': 0,
                    # 调温次数
                    'temperature_times': 0,
                    # 调风次数
                    'mode_times': 0,
                    # 请求时长
                    'request_time': 0,
                    # 总费用
                    'total_cost': 0,
                }
            # 开关次数
            logs = Logs.filter(type='开关机')
            for log in logs:
                ac = log.object
                detail[ac.room_number.name]['on_off_times'] += 1
            # 调度次数
            logs = Logs.filter(type='调度')
            for log in logs:
                ac = log.object
                detail[ac.room_number.name]['dispatch_times'] += 1
            # 详单条数
            for log in Logs:
                ac = log.object
                detail[ac.room_number.name]['detail_times'] +=1
            # 调温次数
            logs = Logs.filter(type='调温')
            for log in logs:
                ac = log.object
                detail[ac.room_number.name]['temperature_times'] +=1
            # 调风次数
            logs = Logs.filter(type='调风')
            for log in logs:
                ac = log.object
                detail[ac.room_number.name]['mode_times'] +=1
            # 请求时长
            for conditioner in conditioners:
                # 获取与当前conditioner相关的请求服务的Log对象
                related_logs = Logs.filter(object=conditioner, type='请求服务')
                # 计算请求时长
                request_time = timedelta()
                # 计算请求时长的总和
                for log in related_logs:
                    end_service_log = Logs.filter(object=conditioner, type='结束服务', time__gt=log.time).first()
                    if end_service_log:
                        request_time += end_service_log.time - log.time
                    else:
                        # 将log.time转换为具有相同时区信息的datetime对象
                        log_time_with_timezone = log.time.replace(tzinfo=timezone.get_current_timezone())

                        # 使用具有相同时区信息的时间进行计算
                        current_time = timezone.now()
                        request_time += current_time - log_time_with_timezone
                        # print(request_time)
                # 将请求时长更新到detail字典中
                detail[conditioner.room_number.name]['request_time'] = request_time.total_seconds()
            # 总费用
            logs = Logs.filter(type='产生费用')
            for conditioner in conditioners:
                related_logs = logs.filter(object=conditioner)
                total_cost = 0
                for log in related_logs:
                    # 解析remark字段以提取费用信息
                    parts = log.remark.split(',')
                    for part in parts:
                        if '产生费用' in part:
                            fee_str = part.strip('产生费用元').split(' ')[-1]
                            fee = float(fee_str)
                            total_cost += fee
                detail[conditioner.room_number.name]['total_cost'] = total_cost
            detail_array = list(detail.values())
            return Response({
                'detail': detail_array,
            }, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

class getRoomExpense(APIView):
    def get(self, request):
        # try:
        room_expense = []
        for ac in Conditioner.objects.all().order_by('room_number'):
            # 计算这1个月内每个空调每天的费用
            logs = Log.objects.filter(object=ac, type='产生费用')
            # 获取当前时间
            current_time = timezone.now()
            # 获取当前时间的前30天
            start_time = current_time - timedelta(days=30)
            # 获取当前时间的前30天内的费用
            logs = logs.filter(time__gte=start_time)
            # 计算每天的费用
            cost_per_day = {}
            for log in logs:
                # 获取当前log的日期
                log_date = log.time.date()
                # 如果当前日期已经在cost_per_day中，则将费用累加
                if log_date in cost_per_day:
                    # 解析remark字段以提取费用信息
                    fee = 0
                    parts = log.remark.split(',')
                    for part in parts:
                        if '产生费用' in part:
                            fee_str = part.strip('产生费用元').split(' ')[-1]
                            fee = float(fee_str)
                    cost_per_day[log_date] += fee
                    # cost_per_day[log_date] += log.cost
                # 如果当前日期不在cost_per_day中，则将费用初始化为0
                else:
                    # cost_per_day[log_date] = log.cost
                    # 解析remark字段以提取费用信息
                    fee = 0
                    parts = log.remark.split(',')
                    for part in parts:
                        if '产生费用' in part:
                            fee_str = part.strip('产生费用元').split(' ')[-1]
                            fee = float(fee_str)
                    cost_per_day[log_date] = fee
            # 将cost_per_day转换为数组
            cost_per_day_array = []
            for date, cost in cost_per_day.items():
                cost_per_day_array.append({
                    'label': date,
                    'cost': cost,
                })
            # 将cost_per_day_array按照日期排序
            cost_per_day_array.sort(key=lambda x: x['label'])
            # 将cost_per_day_array添加到room_expense中
            room_expense.append({
                'labels': ac.room_number.name,
                'datasets': cost_per_day_array,
            })
        return Response({
            'roomExpense': room_expense,
        }, status=status.HTTP_200_OK)
        # except:
        #     return Response(status=status.HTTP_404_NOT_FOUND)
                

class getAllLogs(APIView):
    def get(self, request):
        try:
            log_list = []
            for ac in Conditioner.objects.all():
                logs_after_check_in = []
                check_in_log = Log.objects.filter(object=ac, type='入住').order_by('-time').first()
                if check_in_log:
                    logs_after_check_in = Log.objects.filter(
                        Q(object=ac) & Q(time__gte=check_in_log.time)
                    ).order_by('time')
                for log in logs_after_check_in:
                    log_list.append({
                        'type': log.type,
                        'operator': log.operator,
                        'object': log.object.room_number.name,
                        'time': log.time,
                        'remark': log.remark,
                    })
            return Response({
                'log': log_list,
            }, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
class getAllDetails(APIView):
    def get(self, request):
        # try:
        detail_list = []
        for ac in Conditioner.objects.all():
            logs_after_check_in = []
            detail_after_check_in = []
            check_in_log = Log.objects.filter(object=ac, type='入住').order_by('-time').first()
            if check_in_log:
                detail_after_check_in = Detail.objects.filter(
                    Q(room_number=ac.room_number.name) & Q(start_time__gte=check_in_log.time)
                ).order_by('start_time')
            for detail in detail_after_check_in:
                detail_list.append({
                    'roomNumber': detail.room_number,
                    'requestDuaration': detail.request_duaration,
                    # 用东八区的时间来显示
                    'startTime': detail.start_time + timedelta(hours=8),
                    'endTime': detail.end_time + timedelta(hours=8),
                    'serviceDuaration': detail.service_duaration,
                    'speed': detail.speed,
                    'cost': detail.cost,
                    'fee': detail.fee,
                })
        return Response({
            'detail': detail_list,
        }, status=status.HTTP_200_OK)
        # except:
        #     return Response(status=status.HTTP_404_NOT_FOUND)