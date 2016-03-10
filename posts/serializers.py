from rest_framework import serializers
from posts.models import Archive, Songs
from users.models import UserAccount
from users.serializers import UserSerializer
from intern import settings

class ArchiveSerializer(serializers.ModelSerializer):

    class Meta:
        model = Archive
        fields = ('url', 'created', 'id', 'song', 'upvotes', 'requester')


class SongSerializer(serializers.ModelSerializer):
    upvotes = serializers.ReadOnlyField()

    class Meta:
        model = Songs
        fields = ('created', 'song', 'id', 'upvotes')
