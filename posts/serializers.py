from rest_framework import serializers
from posts.models import Archive, Songs
from users.models import UserAccount
from users.serializers import UserSerializer
import requests,json,time
from datetime import datetime, timedelta, date
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

        start_time = data[len(data) - 1]["start_time"]
        minutes    = data[len(data) - 1]["minutes"]
        seconds    = data[len(data) - 1]["seconds"]



        parse = datetime.strptime(start_time, '%Y-%m-%dT%H:%M:%S.%fZ')
        a = parse + timedelta(minutes=minutes)
        b = a + timedelta(seconds=seconds)

        return Songs.objects.create(
            song=validated_data['song'],
            start_time=b,
            minutes=validated_data['minutes'],
            seconds=validated_data['seconds']
        )
