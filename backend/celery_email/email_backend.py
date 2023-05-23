from typing import Iterable

from celery.result import AsyncResult
from celery_email.tasks import send_email
from django.core.mail.backends.base import BaseEmailBackend
from django.core.mail.message import EmailMultiAlternatives

from .utils import email_to_dict


class CeleryEmailBackend(BaseEmailBackend):
    def send_messages(
        self, email_messages: Iterable[EmailMultiAlternatives]
    ) -> list[AsyncResult] | int:
        if not email_messages:
            return 0
        # num_sent = 0
        result_tasks = []
        for message in email_messages:
            mes = email_to_dict(message)
            # result = send_email.delay(mes)
            # num_sent += result.get()
            result_tasks.append(send_email.delay(mes))

        # return num_sent
        return result_tasks
