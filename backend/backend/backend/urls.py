"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from acounts import urls as acounts_urls
from conditioners import urls as conditioners_urls
from setup import urls as setup_urls
from log import urls as log_urls

urlpatterns = [
    path('admin/', admin.site.urls),
]

urlpatterns += acounts_urls.acounts_urlpatterns
urlpatterns += conditioners_urls.conditioners_urlpatterns
urlpatterns += setup_urls.setup_urlpatterns
urlpatterns += log_urls.log_urlpatterns