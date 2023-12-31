# Generated by Django 4.2.5 on 2023-11-30 06:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('conditioners', '0006_conditioner_queue_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='conditioner',
            name='temperature_now',
            field=models.FloatField(blank=False, default=25.0),
        ),
        migrations.AlterField(
            model_name='conditioner',
            name='temperature_set',
            field=models.FloatField(blank=False, default=25.0),
        ),
    ]
