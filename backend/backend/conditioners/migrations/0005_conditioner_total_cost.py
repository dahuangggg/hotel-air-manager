# Generated by Django 4.2.5 on 2023-11-09 02:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('conditioners', '0004_remove_conditioner_mode_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='conditioner',
            name='total_cost',
            field=models.FloatField(default=0),
        ),
    ]