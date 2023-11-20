from django.urls import path
from . import views

conditioners_urlpatterns = [
    path('api/conditioners/get_ac_info/', views.getAcInfo.as_view(), name='get_ac_info'),
    path('api/conditioners/update_ac_info/', views.updateAcInfo.as_view(), name='update_ac_info'),
    path('api/conditioners/get_all_ac_info/', views.getAllAcInfo.as_view(), name='get_all_ac_info'),
    path('api/conditioners/admin_update_ac_info/', views.adminUpdateAcInfo.as_view(), name='admin_update_ac_info'),
    path('api/conditioners/reception_get_room_number/', views.receptionGetRoomNumbers.as_view(), name='reception_get_room_number'),
    path('api/conditioners/reception_register_for_customer/', views.receptionRegisterForCustom.as_view(), name='reception_register_for_customer'),
    path('api/conditioners/reception_check_out_for_customer/', views.receptionCheckOutForCustom.as_view(),name='reception_check_out_for_customer'),
]