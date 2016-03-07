from rest_framework import serializers
from posts.models import Threads, Songs
from django.contrib.auth.models import User

class ThreadSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = Threads
        fields = ('url', 'created', 'id', 'title', 'body', 'image', 'owner')

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Songs
        fields = ('created', 'song', 'id')
