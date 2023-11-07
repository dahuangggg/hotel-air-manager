from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from acounts.models import User
from rest_framework import status
from .models import Settings

# Create your views here.

class SettingInfo(APIView):
    def get(self, request):
        try:
            setting = Settings.objects.get(id=1)
            return Response({
                'status': setting.status,
                'temperatureUpper': setting.temperature_upper,
                'temperatureLower': setting.temperature_lower,
                'mode': setting.mode,
                'lowSpeedFee': setting.low_speed_fee,
                'midSpeedFee': setting.mid_speed_fee,
                'highSpeedFee': setting.high_speed_fee,
            }, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
    def post(self, request):
        try:
            setting = Settings.objects.get(id=0)
            setting.status = request.data['status']
            setting.temperature_upper = request.data['temperatureUpper']
            setting.temperature_lower = request.data['temperatureLower']
            setting.mode = request.data['mode']
            setting.low_speed_fee = request.data['lowSpeedFee']
            setting.mid_speed_fee = request.data['midSpeedFee']
            setting.high_speed_fee = request.data['highSpeedFee']
            setting.save()
            return Response({
                'status': setting.status,
                'temperatureUpper': setting.temperature_upper,
                'temperatureLower': setting.temperature_lower,
                'mode': setting.mode,
                'lowSpeedFee': setting.low_speed_fee,
                'midSpeedFee': setting.mid_speed_fee,
                'highSpeedFee': setting.high_speed_fee,
            }, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)