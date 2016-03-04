from django.contrib.auth.models import User, Group
from rest_framework import serializers
from users.models import UserAccount


class UserSerializer(serializers.ModelSerializer):
    threads = serializers.HyperlinkedRelatedField(many=True, view_name='thread-detail', read_only=True)
    auth_token = serializers.CharField(required=True)
    class Meta:
        model = User
        fields = ('url', 'id', 'username', 'email', 'threads', 'auth_token')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')
