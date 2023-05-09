from django.contrib.auth.models import User
from django.db import models

User._meta.get_field("email")._unique = True


class Note(models.Model):
    title = models.CharField(max_length=128)
    content = models.TextField(null=True, blank=True)
    last_edited = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    class Meta:
        indexes = [
            models.Index(
                fields=["user", "id"],
                include=["title", "content", "last_edited"],
                name="user_idx",
            ),
        ]
