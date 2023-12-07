# Generated by Django 4.2.5 on 2023-12-07 12:11

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="User_group1",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("username", models.CharField(max_length=20)),
                ("password", models.CharField(max_length=20)),
                ("role", models.CharField(max_length=20)),
                ("id_card", models.CharField(blank=True, max_length=20, null=True)),
                (
                    "phone_number",
                    models.CharField(blank=True, max_length=20, null=True),
                ),
                ("token", models.CharField(blank=True, max_length=1024, null=True)),
            ],
        ),
    ]