# clery.py是celery的配置文件，用于配置celery的运行环境，包括broker、backend、导入任务等
import os 
from celery import Celery

# 设置环境变量
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# 创建celery应用
app = Celery('backend')

# 导入celery配置
app.config_from_object('django.conf:settings', namespace='CELERY')

# 自动发现并注册任务
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {0!r}'.format(self.request))