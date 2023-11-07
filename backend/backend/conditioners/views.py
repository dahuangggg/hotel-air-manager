from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from acounts.models import User
from rest_framework import status
from .models import Conditioner

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
            }, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

class updateAcInfo(APIView):
    def post(self, request):
        try:
            user = User.objects.get(name=request.data['token'])
            ac = Conditioner.objects.get(room_number=user)
            ac.temperature_set = request.data['targetTemperature']
            ac.status = request.data['acStatus']
            ac.mode = request.data['acMode']
            ac.save()
            return Response({
                'room_number': ac.room_number.name,
                'currentTemperature': ac.temperature_now,
                'targetTemperature': ac.temperature_set,
                'acStatus': ac.status,
                'acMode': ac.mode,
            })
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
            ac = Conditioner.objects.get(room_number=user)
            ac.temperature_set = request.data['targetTemperature']
            ac.status = request.data['acStatus']
            ac.mode = request.data['acMode']
            ac.save()
            return Response({
                'room_number': ac.room_number.name,
                'currentTemperature': ac.temperature_now,
                'targetTemperature': ac.temperature_set,
                'acStatus': ac.status,
                'acMode': ac.mode,
            })
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)  