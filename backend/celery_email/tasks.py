import os

from celery import Celery
from django.conf import settings
from django.core.mail.backends.smtp import EmailBackend

from .utils import dict_to_email

app = Celery(
    "tasks",
    backend=os.environ.get("CELERY_RESULT_BACKEND"),
    broker=os.environ.get("CELERY_BROKER_URL"),
)


@app.task
def send_email(message: dict) -> int | str:
    try:
        settings.configure()
    except Exception:
        pass
    conn = EmailBackend(
        host=os.environ.get("EMAIL_HOST"),
        port=os.environ.get("EMAIL_PORT"),
        username=os.environ.get("EMAIL_HOST_USER"),
        password=os.environ.get("EMAIL_HOST_PASSWORD"),
        use_tls=os.environ.get("EMAIL_USE_TLS"),
    )
    try:
        conn.open()
    except Exception as e:
        return str(e)
    mes = dict_to_email(message)
    mes.connection = conn
    sent = mes.send()
    conn.close()
    return 1 if sent else 0
