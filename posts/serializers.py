from rest_framework import serializers
from posts.models import Thread
from django.contrib.auth.models import User

class ThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = ('id', 'title', 'image')

class UserSerializer(serializers.ModelSerializer):
    threads = serializers.PrimaryKeyRelatedField(many=True, queryset=Thread.objects.all())
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = User
        fields = ('id', 'username', 'threads', 'owner')
