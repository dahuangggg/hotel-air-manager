#!/bin/sh

until cd /app/server
do
    echo "Waiting for server volume..."
done

echo "Migrate DB"
until python manage.py migrate
do
    echo "Waiting for db to be ready..."
    sleep 2
done

python manage.py collectstatic --noinput

python manage.py createsuperuser --noinput

celery -A backend worker --loglevel=error -P gevent --concurrency 1 -E &
celery -A backend beat -l ERROR --scheduler django_celery_beat.schedulers:DatabaseScheduler --max-interval 60 &

gunicorn backend.wsgi --bind 0.0.0.0:8000 --workers 4 --threads 4

# for debug
# python manage.py runserver 0.0.0.0:8000