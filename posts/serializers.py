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
        fields = ('url', 'created', 'id', 'song', 'upvotes', 'requester',
         'title', 'minutes', 'seconds', 'favorites')

    def create(self, validated_data):
        return Archive.objects.create(
            requester=self.context['request'].user,
            song=validated_data['song'],
            upvotes=validated_data['upvotes'],
            title=validated_data['title'],
            minutes=validated_data['minutes'],
            seconds=validated_data['seconds']
        )


class SongSerializer(serializers.ModelSerializer):
    upvotes = serializers.ReadOnlyField()

    class Meta:
        model = Songs
        fields = ('title', 'created', 'song', 'id', 'upvotes', 'start_time',
        'minutes', 'seconds', 'requester')

    def create(self, validated_data):
        r = requests.get('http://localhost:8000/api/songs/')
        data = json.loads(r.text)
        key = 'AIzaSyBozEtHPwS2fZz3aVpZlaDPeXIzHQeJo7k'
        url = 'https://www.googleapis.com/youtube/v3/videos?id=' + validated_data['song'] + '&part=contentDetails&key=' + key
        r = requests.get(url)
        resp = json.loads(r.text)
        c = resp['items'][0]['contentDetails']['duration']
        d = c.split('PT')[1].split('M')
        nMinutes = d[0]
        nSeconds = d[1].split('S')[0]
        start_time = str(datetime.now())
        minutes = nMinutes
        seconds = nSeconds
        if not seconds:
            seconds = '1'

        if "Z" not in start_time:
            parse = datetime.strptime(start_time, '%Y-%m-%d %H:%M:%S.%f')
            a = parse + timedelta(minutes=int(minutes))
            b = a + timedelta(seconds=int(seconds))
            return Songs.objects.create(
                song=validated_data['song'],
                start_time=b,
                minutes=minutes,
                seconds=seconds,
                title=validated_data['title'],
                requester=self.context['request'].user
            )

        else:
            parse = datetime.strptime(start_time, '%Y-%m-%dT%H:%M:%S.%fZ')
            a = parse + timedelta(minutes=minutes)
            b = a + timedelta(seconds=seconds)

            return Songs.objects.create(
                song=validated_data['song'],
                start_time=b,
                minutes=minutes,
                seconds=seconds,
                title=validated_data['title'],
                requester=self.context['request'].user
            )
