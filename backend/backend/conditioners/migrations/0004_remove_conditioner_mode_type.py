# Generated by Django 4.2.5 on 2023-11-06 08:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('conditioners', '0003_conditioner_mode_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='conditioner',
            name='mode_type',
        ),
    ]
