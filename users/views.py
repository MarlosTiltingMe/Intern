from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import viewsets, generics
from users.serializers import UserSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserSerializer

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserByName(generics.ListCreateAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        username = self.kwargs['username']
        return User.objects.filter(username=username)
