from rest_framework import serializers
from posts.models import Archive, Songs
from django.contrib.auth.models import User
from intern import settings

class ArchiveSerializer(serializers.ModelSerializer):

    class Meta:
        model = Archive
        fields = ('url', 'created', 'id', 'song')

class SongSerializer(serializers.ModelSerializer):
    upvotes = serializers.ReadOnlyField()

    class Meta:
        model = Songs
        fields = ('created', 'song', 'id', 'upvotes')
