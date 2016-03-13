from rest_framework import serializers
from posts.models import Archive, Songs
from users.models import UserAccount
from users.serializers import UserSerializer
import requests,json,time
from intern import settings

class ArchiveSerializer(serializers.ModelSerializer):

    class Meta:
        model = Archive
        fields = ('url', 'created', 'id', 'song', 'upvotes', 'requester')


class SongSerializer(serializers.ModelSerializer):
    upvotes = serializers.ReadOnlyField()

    class Meta:
        model = Songs
        fields = ('created', 'song', 'id', 'upvotes', 'start_time',
        'minutes', 'seconds')

    def create(self, validated_data):
        r = requests.get('http://localhost:8000/api/songs/')
        data = json.loads(r.text)

        start_time = data[0]["start_time"]
        minutes    = data[0]["minutes"]
        seconds    = data[0]["seconds"]

        print(time.asctime( time.localtime(time.time()) ))
