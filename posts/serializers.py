from rest_framework import serializers
from posts.models import Threads
from django.contrib.auth.models import User

class ThreadSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    thread = serializers.HyperlinkedIdentityField(view_name='thread-detail', format='html')
    class Meta:
        model = Threads
        fields = ('url', 'created', 'id', 'title', 'body', 'image', 'owner', 'thread')

class UserSerializer(serializers.ModelSerializer):
    threads = serializers.HyperlinkedRelatedField(many=True, view_name='thread-detail', read_only=True)
    class Meta:
        model = User
        fields = ('url', 'id', 'username', 'threads')
