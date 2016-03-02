from posts.models import Thread
from posts.serializers import ThreadSerializer, UserSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, mixins, generics
from django.contrib.auth.models import User

class ThreadList(generics.ListCreateAPIView):
    """
    List all threads, homie
    """
    queryset = Thread.objects.all()
    serializer_class = ThreadSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        
class ThreadDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Get/Maniupulate a single thread.
    """
    queryset = Thread.objects.all()
    serializer_class = ThreadSerializer

class UserList(generics.ListAPIView):
    queryser = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
