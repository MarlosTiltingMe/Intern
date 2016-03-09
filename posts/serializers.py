from rest_framework import serializers
from posts.models import Archive, Songs
from users.models import UserAccount
from users.serializers import UserSerializer
from intern import settings

class ArchiveSerializer(serializers.ModelSerializer):
    # requester = UserSerializer(read_only=True, required=False)
    requester = serializers.ReadOnlyField(source='requester.username')
    class Meta:
        model = Archive
        fields = ('url', 'created', 'id', 'song', 'upvotes', 'requester')

    def get_validated_exclusions(self, *args, **kwargs):
        exclusions = super(ArchiveSerializer, self).get_validated_exclusions()

        exclusions += ['requester']


class SongSerializer(serializers.ModelSerializer):
    upvotes = serializers.ReadOnlyField()

    class Meta:
        model = Songs
        fields = ('created', 'song', 'id', 'upvotes')
