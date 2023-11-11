from setup.models import Settings
from .models import Log

# Create your views here.

def write_log(type, operator, ac, remark='无', request=None, up = True):
    if type == '开关机':
        log_entry = Log(
            type=type,
            operator=operator,
            object=ac,
            remark = '开机' if ac.status else '关机'
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
    elif type == '产生费用':
        setting = Settings.objects.get(id=1)
        if ac.mode == '低风速':
            fee = setting.low_speed_fee
        elif ac.mode == '中风速':
            fee = setting.mid_speed_fee
        elif ac.mode == '高风速':
            fee = setting.high_speed_fee
        if up:
            log_entry = Log(
                type=type,
                operator=operator,
                object=ac,
                remark = f'温度从{ac.temperature_now} °C升高到{ac.temperature_now+1} °C,当前风速为{ac.mode},对应费率为{fee}元/1°C,产生费用{fee}元,费用从{ac.cost}元增加到{ac.cost + fee}元'
            )
        else:
            log_entry = Log(
                type=type,
                operator=operator,
                object=ac,
                remark = f'温度从{ac.temperature_now} °C降低到{ac.temperature_now-1} °C,当前风速为{ac.mode},对应费率为{fee}元/1°C,产生费用{fee}元,费用从{ac.cost}元增加到{ac.cost + fee}元'
            )
        log_entry.save()
        