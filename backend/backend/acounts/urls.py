from django.urls import path
from . import views

acounts_urlpatterns = [
    path('api/acounts/login/', views.LoginView.as_view()),
    path('api/acounts/add_room/', views.AddRoomView.as_view()),
    path('api/acounts/change_password/', views.ChangePasswordView.as_view()),
    path('api/acounts/get_rooms_name/', views.GetRoomsNameView.as_view()),
]