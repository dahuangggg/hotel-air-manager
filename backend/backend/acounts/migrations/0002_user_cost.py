# Generated by Django 4.2.5 on 2023-11-06 08:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('acounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='cost',
            field=models.FloatField(default=0),
        ),
    ]