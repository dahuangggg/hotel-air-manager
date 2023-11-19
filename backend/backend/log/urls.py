from django.urls import path
from . import views

log_urlpatterns = [
    path('api/logs/get_ac_info/', views.getAcInfo.as_view(), name='get_ac_info'),
    path('api/logs/get_all_logs/', views.getAllLogs.as_view(), name='get_all_logs'),
]