from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from acounts.models import User
from rest_framework import status
from .models import Settings
from conditioners.models import Conditioner
from log.views import write_log

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
            setting = Settings.objects.get(id=1)
            if 'status' in request.data:
                # if setting.status != request.data['status'] & setting.status:
                #     for ac in Conditioner.objects.all():
                #         if ac.queue_status != '无事可做':
                #             ac.queue_status  = '无事可做'
                #             ac.save()
                #             write_log('调度','系统',ac,'管理员关闭主控机,服务结束')
                setting.status = request.data['status']
            if 'temperatureUpper' in request.data:
                setting.temperature_upper = request.data['temperatureUpper']
            if 'temperatureLower' in request.data:
                setting.temperature_lower = request.data['temperatureLower']
            if 'mode' in request.data:
                setting.mode = request.data['mode']
            if 'lowSpeedFee' in request.data:
                setting.low_speed_fee = request.data['lowSpeedFee']
            if 'midSpeedFee' in request.data:
                setting.mid_speed_fee = request.data['midSpeedFee']
            if 'highSpeedFee' in request.data:
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