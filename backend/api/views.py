# from django.shortcuts import render
from rest_framework import viewsets

# from .authentication import BearerAuthentication
from .models import Note

# from .permissions import IsOwner
from .serializers import NoteSerializer

# from rest_framework.authentication import SessionAuthentication
# from rest_framework.permissions import IsAuthenticated


# Create your views here.


class NotesViewset(viewsets.ModelViewSet):
    # authentication_classes = [SessionAuthentication, BearerAuthentication]
    # permission_classes = [IsAuthenticated, IsOwner]
    serializer_class = NoteSerializer
    queryset = Note.objects.all()

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
