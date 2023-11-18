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
            password = request.data['password']
            room_number = request.data['room_number']
            user = User.objects.get(name=room_number)
            user.password = password
            user.save()
            write_log('入住', '前台', user.conditioner, remark='无')
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)