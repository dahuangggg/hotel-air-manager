from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from acounts.models import User
from rest_framework import status
from .models import Conditioner
from setup.models import Settings
from .task import request_conditioner_run
from django.utils import timezone
from log.models import Log
from log.views import write_log
from django.db.models import Q
from django.db import transaction

class getAcInfo(APIView):
    def post(self, request):
        try:
            user = User.objects.get(name=request.data['token'])
            ac = Conditioner.objects.get(room_number=user)
            return Response({
                'roomNumber': ac.room_number.name,
                'currentTemperature': ac.temperature_now,
                'targetTemperature': ac.temperature_set,
                'acStatus': ac.status,
                'acMode': ac.mode,
                'cost': ac.cost,
                'totalCost': ac.total_cost,
                'queueStatus': ac.queue_status,
            }, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

class updateAcInfo(APIView):
    @transaction.atomic
    def post(self, request):
        try:
            user = User.objects.get(name=request.query_params.get('token', None))
            setting = Settings.objects.get(id=1)
            ac = Conditioner.objects.get(room_number=user)
            if ac.temperature_set != request.data['targetTemperature']:
                write_log('调温', '客户', ac, request=request)
                ac.temperature_set = request.data['targetTemperature']
                ac.save()
            if ac.status != request.data['acStatus']:
                write_log('开关机', '客户', ac)
                ac.status = request.data['acStatus']
                ac.save()
                # # 关机的时候需要调度
                # if (not ac.status) & (ac.queue_status!='无事可做'):
                #     ac.queue_status = "无事可做"
                #     ac.save()
                #     write_log('调度', '系统', ac, '用户关闭空调, 服务结束')
            if ac.mode != request.data['acMode']:
                write_log('调风', '客户', ac, request=request)
                ac.mode = request.data['acMode']
                ac.save()
            if ac.temperature_now > ac.temperature_set and setting.mode == '制冷' and ac.queue_status == '无事可做' and ac.status:
                request_conditioner_run(ac.id)
            if ac.temperature_now < ac.temperature_set and setting.mode == '制热' and ac.queue_status == '无事可做'and ac.status:
                request_conditioner_run(ac.id)
            return Response({
                'room_number': ac.room_number.name,
                'currentTemperature': ac.temperature_now,
                'targetTemperature': ac.temperature_set,
                'acStatus': ac.status,
                'acMode': ac.mode,
                'code': ac.cost,
                'totalCost': ac.total_cost,
            }, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

class getAllAcInfo(APIView):
    def post(self, request):
        try:
            user = User.objects.get(name=request.data['token'])
            acs = Conditioner.objects.all()
            acs_info = []
            for ac in acs:
                acs_info.append({
                    'roomNumber': ac.room_number.name,
                    'currentTemperature': ac.temperature_now,
                    'targetTemperature': ac.temperature_set,
                    'acStatus': ac.status,
                    'acMode': ac.mode,
                    'cost': ac.cost,
                    'totalCost': ac.total_cost,
                    'queueStatus': ac.queue_status,
                })
            return Response({
                'acs_info': acs_info,
            }, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

class adminUpdateAcInfo(APIView):
    @transaction.atomic
    def post(self, request):
        try:
            user = User.objects.get(name=request.data['roomNumber'])
            setting = Settings.objects.get(id=1)
            ac = Conditioner.objects.get(room_number=user)
            if ac.temperature_set != request.data['targetTemperature']:
                write_log('调温', '管理员', ac, request=request)
                ac.temperature_set = request.data['targetTemperature']
            if ac.status != request.data['acStatus']:
                write_log('开关机', '管理员', ac)
                ac.status = request.data['acStatus']
                # 关机的时候需要调度
                # if (not ac.status) & (ac.queue_status!='无事可做'):
                #     ac.queue_status="无事可做"
                #     write_log('调度', '系统', ac, "管理员关闭了空调,调度结束")
            if ac.mode != request.data['acMode']:
                write_log('调风', '管理员', ac, request=request)
            ac.mode = request.data['acMode']
            ac.save()
            if ac.temperature_now > ac.temperature_set and setting.mode == '制冷' and ac.queue_status == '无事可做' and ac.status:
                request_conditioner_run(ac.id)
            if ac.temperature_now < ac.temperature_set and setting.mode == '制热' and ac.queue_status == '无事可做'and ac.status:
                request_conditioner_run(ac.id)
            return Response({
                'room_number': ac.room_number.name,
                'currentTemperature': ac.temperature_now,
                'targetTemperature': ac.temperature_set,
                'acStatus': ac.status,
                'acMode': ac.mode,
                'code': ac.cost,
                'totalCost': ac.total_cost,
                'queueStatus': ac.queue_status,
            }, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)  

# 返回房间是否空闲的信息
class receptionGetRoomNumbers(APIView):
    @transaction.atomic
    def get(self, request):
        try:
            logs = Log.objects.filter(Q(type='入住') | Q(type='结算'))
            conditioners = Conditioner.objects.all()
            roomNumber = {}
            for conditioners in conditioners:
                roomNumber[conditioners.room_number.name] = True
            for log in logs:
                if log.type == '入住':
                    roomNumber[log.object.room_number.name] = False
                else:
                    roomNumber[log.object.room_number.name] = True
            return Response({
                'room_numbers': roomNumber,
            }, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

# 这是前台在为顾客办理入住
class receptionRegisterForCustom(APIView):
    @transaction.atomic
    def post(self, request):
        try:
            # 防止check in非空闲的空调
            roomNumber = {}
            for conditioners in Conditioner.objects.all():
                roomNumber[conditioners.room_number.name] = True
            for log in Log.objects.filter(Q(type='入住') | Q(type='结算')):
                if log.type == '入住':
                    roomNumber[log.object.room_number.name] = False
                else:
                    roomNumber[log.object.room_number.name] = True

            password = request.data['password']
            room_number = request.data['room_number']
            if not roomNumber[room_number]:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            user = User.objects.get(name=room_number)
            user.password = password
            user.save()
            write_log('入住', '前台', user.conditioner, remark='无')
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

class receptionCheckOutForCustom(APIView):
    @transaction.atomic
    def post(self, request):
        try:
            # 防止check out空闲的空调
            roomNumber = {}
            for conditioners in Conditioner.objects.all():
                roomNumber[conditioners.room_number.name] = True
            for log in Log.objects.filter(Q(type='入住') | Q(type='结算')):
                if log.type == '入住':
                    roomNumber[log.object.room_number.name] = False
                else:
                    roomNumber[log.object.room_number.name] = True
            room_number = request.data['room_number']
            if roomNumber[room_number]:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            user = User.objects.get(name=room_number)
            user.password = ''
            user.save()
            write_log('结算', '前台', user.conditioner, remark='无')
            # 更新空调的状态
            ac = user.conditioner
            ac.status = False
            ac.temperature_set = 25
            ac.mode = '中风速'
            ac.total_cost += ac.cost
            ac.cost = 0
            ac.save()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

# 重置所有空调的状态,一定要在确保所有功能无误以后再调用,反正就是一个作业,不设置权限了
class resetAllAcInfo(APIView):
    @transaction.atomic
    def get(self, request):
        try:
            temperature_now = {
                "房间101": 10,
                "房间102": 15,
                "房间103": 18,
                "房间104": 12,
                "房间105": 14,
            }
            roomNumber = {}
            for conditioners in Conditioner.objects.all():
                roomNumber[conditioners.room_number.name] = True
            for log in Log.objects.filter(Q(type='入住') | Q(type='结算')):
                if log.type == '入住':
                    roomNumber[log.object.room_number.name] = False
                else:
                    roomNumber[log.object.room_number.name] = True
            conditioners = Conditioner.objects.all()
            for ac in conditioners:
                # 先为每个房间办理退房
                if not roomNumber[ac.room_number.name]:
                    user = User.objects.get(name=ac.room_number.name)
                    user.password = ''
                    user.save()
                    write_log('结算', '前台', user.conditioner, remark='无')
                # 再重置空调的状态
                ac.status = False
                ac.temperature_set = 22
                ac.temperature_now = temperature_now[ac.room_number.name]
                ac.mode = '中风速'
                ac.total_cost += ac.cost
                ac.cost = 0
                ac.save()
            # setting的状态也要重置
            setting = Settings.objects.get(id=1)
            setting.mode = '制热'
            setting.temperature_upper = 25
            setting.temperature_lower = 18
            setting.low_speed_fee = 1
            setting.mid_speed_fee = 1
            setting.high_speed_fee = 1
            setting.save()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)