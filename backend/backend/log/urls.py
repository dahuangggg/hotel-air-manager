from django.urls import path
from . import views

log_urlpatterns = [
    path('api/logs/get_ac_info/', views.getAcInfo.as_view(), name='get_ac_info'),
    path('api/logs/get_all_logs/', views.getAllLogs.as_view(), name='get_all_logs'),
    path('api/logs/get_room_expense/', views.getRoomExpense.as_view(), name='get_room_expenses'),
    path('api/logs/get_all_details/', views.getAllDetails.as_view(), name='get_all_details'),
]