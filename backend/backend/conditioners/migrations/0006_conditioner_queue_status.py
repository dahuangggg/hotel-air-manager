# Generated by Django 4.2.5 on 2023-11-09 04:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('conditioners', '0005_conditioner_total_cost'),
    ]

    operations = [
        migrations.AddField(
            model_name='conditioner',
            name='queue_status',
            field=models.CharField(choices=[('运行中', '运行中'), ('等待中', '等待中'), ('无事可做', '无事可做')], default='无事可做', max_length=20),
        ),
    ]