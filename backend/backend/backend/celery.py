# clery.py是celery的配置文件，用于配置celery的运行环境，包括broker、backend、导入任务等
import os 
from celery import Celery

import sys
CURRENT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, CURRENT_DIR)

# 设置环境变量
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# 创建celery应用
app = Celery('backend')

# 导入celery配置
app.config_from_object('django.conf:settings', namespace='CELERY')

# 自动发现并注册任务
app.autodiscover_tasks()

@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    try:
        import django
        django.setup()
        from conditioners.task import update_temperature, check_and_update_conditioner_status
        sender.add_periodic_task(10.0, update_temperature.s(), name='update_temperature')
        sender.add_periodic_task(20.0, check_and_update_conditioner_status.s(), name='check_and_update_conditioner_status')
    except Exception as e:
        print("Problem with setup_periodic_tasks")
        print(str(e))

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {0!r}'.format(self.request))