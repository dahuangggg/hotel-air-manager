from django.urls import path
from . import views

setup_urlpatterns = [
    path('api/setup/settingInfo', views.SettingInfo.as_view()),
]