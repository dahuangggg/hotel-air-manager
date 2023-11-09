from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from acounts.models import User
from rest_framework import status
from .models import Conditioner
from setup.models import Settings
from .task import request_conditioner_run

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
        # try:
        user = User.objects.get(name=request.query_params.get('token', None))
        setting = Settings.objects.get(id=1)
        ac = Conditioner.objects.get(room_number=user)
        ac.temperature_set = request.data['targetTemperature']
        ac.status = request.data['acStatus']
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
        # except:
        #     return Response(status=status.HTTP_404_NOT_FOUND)

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
        try:
            user = User.objects.get(name=request.data['roomNumber'])
            setting = Settings.objects.get(id=1)
            ac = Conditioner.objects.get(room_number=user)
            ac.temperature_set = request.data['targetTemperature']
            ac.status = request.data['acStatus']
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
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)  
