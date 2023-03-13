from django.db import models
from django.contrib.auth.models import User


User._meta.get_field('email')._unique = True


# Create your models here.

class Note(models.Model):
    title = models.CharField(max_length=128)
    content = models.TextField(null=True, blank=True)
    last_edited = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.title