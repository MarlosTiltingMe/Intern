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

        if(len(data) > 0):
            start_time = data[0]["start_time"]
            minutes    = data[0]["minutes"]
            seconds    = data[0]["seconds"]
        else:
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

        if "Z" not in start_time:
            parse = datetime.strptime(start_time, '%Y-%m-%d %H:%M:%S.%f')
            a = parse + timedelta(minutes=int(minutes))
            b = a + timedelta(seconds=int(seconds))
            return Songs.objects.create(
                song=validated_data['song'],
                start_time=b,
                minutes=minutes,
                seconds=seconds
            )

        else:
            parse = datetime.strptime(start_time, '%Y-%m-%dT%H:%M:%S.%fZ')
            a = parse + timedelta(minutes=minutes)
            b = a + timedelta(seconds=seconds)

            return Songs.objects.create(
                song=validated_data['song'],
                start_time=b,
                minutes=minutes,
                seconds=seconds
            )
