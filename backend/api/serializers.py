from rest_framework import serializers

from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.id")

    class Meta:
        model = Note
        fields = "__all__"
