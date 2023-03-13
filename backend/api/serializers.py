from .models import Note
from rest_framework import serializers


class NoteSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.id')
    class  Meta:
        model = Note
        fields = "__all__"
        
