import json
from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import viewsets, generics, views, status
from rest_framework.response import Response
from users.serializers import UserSerializer
from django.contrib.auth import authenticate, login

User = get_user_model()

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserByName(generics.ListCreateAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        username = self.kwargs['username']
        return User.objects.filter(username=username)

class AccountViewSet(viewsets.ModelViewSet):
    lookup_field = 'username'
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            User.objects.create_user(**serializer.validated_data)

            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created'
        }, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    def post(self, request, format=None):
        data = request.data

        username = data.get('username', None)
        password = data.get('password', None)

        account = authenticate(username=username, password=password)

        if account is not None:
            login(request, account)

            serialized = UserSerializer(account)

            return Response(serialized.data)
        else:
            return Response({
                'status': 'Unathorized',
                'message': 'Lazy error message.'
            }, status=status.HTTP_401_UNAUTHORIZED)
