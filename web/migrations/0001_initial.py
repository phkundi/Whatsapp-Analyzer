# Generated by Django 3.0.3 on 2020-03-11 20:18

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('messages', models.IntegerField()),
                ('name', models.CharField(blank=True, max_length=50)),
            ],
        ),
    ]