# Generated by Django 4.2.5 on 2023-11-30 06:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('setup', '0002_settings_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='settings',
            name='high_speed_fee',
            field=models.FloatField(default=1, verbose_name='高速风费率 (元/1C°)'),
        ),
        migrations.AlterField(
            model_name='settings',
            name='low_speed_fee',
            field=models.FloatField(default=1, verbose_name='低速风费率 (元/1C°)'),
        ),
    ]
