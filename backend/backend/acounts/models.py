from django.db import models

# Create your models here.

class User(models.Model):
    name = models.CharField(max_length=20)
    # password为手机尾号后4位
    password = models.CharField(max_length=4)

    def __str__(self):
        return self.name