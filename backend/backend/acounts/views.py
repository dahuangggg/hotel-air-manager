from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from conditioners.models import Conditioner
from log.models import Log
from django.db.models import Q

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
        if user.password == request.data['password']:
            return Response({
                'success': '登陆成功',
                'token': user.name,
                }, status=status.HTTP_200_OK
            )
        else:
            return Response({
                'error': '密码错误',
                }, status=status.HTTP_400_BAD_REQUEST)

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
        # 初始化所有房间为非空闲
        roomNumber = {}
        for conditioners in Conditioner.objects.all():
            roomNumber[conditioners.room_number.name] = False
        # 更新房间状态
        for log in Log.objects.filter(Q(type='入住') | Q(type='结算')):
            if log.type == '入住':
                roomNumber[log.object.room_number.name] = True
            else:
                roomNumber[log.object.room_number.name] = False
        # 生成入住房间列表
        rooms_name = []
        for room, isOccupied in roomNumber.items():
            if isOccupied:
                rooms_name.append(room)
        # 返回入住房间列表
        return Response({
            'rooms_name': rooms_name
            }, status=status.HTTP_200_OK)
