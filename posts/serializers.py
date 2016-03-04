from rest_framework import serializers
from posts.models import Threads, Boards
from django.contrib.auth.models import User

class ThreadSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = Threads
        fields = ('url', 'created', 'id', 'title', 'body', 'image', 'owner')

class BoardSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    board = serializers.HyperlinkedIdentityField(view_name='board-detail', format='html')
    class Meta:
        model = Boards
        fields = ('image', 'id', 'owner', 'desc', 'name', 'board')
