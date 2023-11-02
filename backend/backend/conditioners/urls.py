from django.urls import path
from . import views

conditioners_urlpatterns = [
    path('api/conditioners/get_ac_info/', views.getAcInfo.as_view(), name='get_ac_info'),
    path('api/conditioners/update_ac_info/', views.updateAcInfo.as_view(), name='update_ac_info'),
    path('api/conditioners/get_all_ac_info/', views.getAllAcInfo.as_view(), name='get_all_ac_info'),
]