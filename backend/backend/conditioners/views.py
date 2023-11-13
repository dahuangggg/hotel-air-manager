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

# Create your views here.

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
            if ac.mode != request.data['acMode']:
                write_log('调风', '客户', ac, request=request)
                ac.mode = request.data['acMode']
                ac.save()
            if ac.temperature_now > ac.temperature_set and setting.mode == '制冷' and ac.queue_status == '无事可做':
                request_conditioner_run(ac.id)
            if ac.temperature_now < ac.temperature_set and setting.mode == '制热' and ac.queue_status == '无事可做':
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
    def post(self, request):
        # try:
        user = User.objects.get(name=request.data['roomNumber'])
        setting = Settings.objects.get(id=1)
        ac = Conditioner.objects.get(room_number=user)
        if ac.temperature_set != request.data['targetTemperature']:
            write_log('调温', '管理员', ac, request=request)
            ac.temperature_set = request.data['targetTemperature']
            ac.save()
        if ac.status != request.data['acStatus']:
            write_log('开关机', '管理员', ac)
            ac.status = request.data['acStatus']
            ac.save()
        if ac.mode != request.data['acMode']:
            write_log('调风', '管理员', ac, request=request)
        ac.mode = request.data['acMode']
        ac.save()
        if ac.temperature_now > ac.temperature_set and setting.mode == '制冷' and ac.queue_status == '无事可做':
            request_conditioner_run(ac.id)
        if ac.temperature_now < ac.temperature_set and setting.mode == '制热' and ac.queue_status == '无事可做':
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
        # except:
        #     return Response(status=status.HTTP_404_NOT_FOUND)  

class receptionGetRoomNumbers(APIView):
    def get(self, request):
        try:
            # 这里是xzm要做的
            roomNumber = {
                "房间101": True,
                "房间102": False,
                "房间103": True,
                "房间104": False,
                "房间105": False,
                "房间106": True,
                "房间107": False,
                "房间108": True,
                "房间109": False,
                "房间110": False,
            };
            return Response({
                'room_numbers': roomNumber,
            }, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

class receptionRegisterForCustom(APIView):
    def post(self, request):
        try:
            password = request.data['password']
            room_number = request.data['room_number']
            # 这里是xzm要做的
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)