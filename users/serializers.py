from rest_framework import serializers
from users.models import UserAccount
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    threads = serializers.HyperlinkedRelatedField(many=True, view_name='thread-detail', read_only=True)
    class Meta:
        model = User
        fields = ('url', 'id', 'username', 'email', 'threads', 'auth_token')
