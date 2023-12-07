from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from conditioners.models import Conditioner
from log.models import Log
from django.db.models import Q
import requests
import json

# Create your views here.
# 登陆
class LoginView(APIView):
    def post(self, request):
        try:
            user = User.objects.get(name=request.data['name'])
        except:
            return Response({
                'error': '用户名不存在'
                }, status=status.HTTP_404_NOT_FOUND)

        # 请求group1的登陆接口
        user_group = user.user_group1
        url = "http://flask.dahuangggg.me:5000/login"
        payload = json.dumps({
        "username": user_group.username,
        "password": user_group.password,
        "role": user_group.role
        })
        headers = {
        'Content-Type': 'application/json'
        }
        response = requests.request("POST", url, headers=headers, data=payload)
        user_group.token = response.json()['token']
        user_group.save()

        if user.password == reque222st.data['password']:
            return Response({
                'success': '登陆成功',
                'token': user.name,
                }, status=status.HTTP_200_OK
            )
        else:
            return Response({
                'error': '密码错误',
                }, status=status.HTTP_400_BAD_REQUEST)

class LoginGroup1View(APIView):
    def post(self, request):
        room_id = request.data['room_id']
        password = request.data['password']

        url = "http://10.129.255.146:8080/login"

        payload = json.dumps({
        "room_id": room_id,
        "password": password
        })
        headers = {
        'Content-Type': 'application/json'
        }
        response = requests.request("POST", url, headers=headers, data=payload)

        print(response.text)
        return Response({
            'success': '登陆成功'
        }, status=status.HTTP_200_OK)

# 注册(添加房间)[弃用]
class AddRoomView(APIView):
    def post(self, request):
        try:
            user = User.objects.get(name=request.data['name'])
            return Response({
                'error': '用户名已存在'
                }, status=status.HTTP_400_BAD_REQUEST)
        except:
            user = User.objects.create(name=request.data['name'], password=request.data['password'])
            conditioners = Conditioner.objects.create(temperature_now=25, temperature_set=25, mode='0', status=False, room_number=user)
            return Response({
                'success': '注册成功'
                }, status=status.HTTP_201_CREATED)

# 修改密码
class ChangePasswordView(APIView):
    def post(self, request):
        try:
            user = User.objects.get(name=request.data['name'])
            if user.password == request.data['old_password']:
                user.password = request.data['new_password']
                user.save()
                return Response({
                    'success': '修改密码成功'
                    }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': '原密码错误'
                    }, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({
                'error': '用户名不存在'
                }, status=status.HTTP_404_NOT_FOUND)

class GetRoomsNameView(APIView):
    def get(self, request):
        # 防止check out空闲的空调
        roomNumber = {}
        for conditioners in Conditioner.objects.all().order_by('room_number'):
            roomNumber[conditioners.room_number.name] = True
        for log in Log.objects.filter(Q(type='入住') | Q(type='结算')):
            if log.type == '入住':
                roomNumber[log.object.room_number.name] = False
            else:
                roomNumber[log.object.room_number.name] = True
        rooms_name = []
        for room in roomNumber:
            if not roomNumber[room]:
                rooms_name.append(room)
        return Response({
            'rooms_name': rooms_name
            }, status=status.HTTP_200_OK)
