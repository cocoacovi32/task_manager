release: cd task_manager\ backend/collab_task_manager/backend && python manage.py migrate
web: cd task_manager\ backend/collab_task_manager/backend && gunicorn --bind 0.0.0.0:$PORT task_manager.wsgi:application --timeout 120 --workers 1
