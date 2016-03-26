from rest_framework import serializers
from users.models import UserAccount
from posts.models import Songs
User = UserAccount

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    favorites = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset = Songs.objects.all(),
        required=False)

    class Meta:
        model = UserAccount
        fields = ('id', 'username', 'email', 'favorites', 'password', 'favorites')
        def create(self, validated_data):
            return UserAccount.objects.create(**validated_data)

        def update(self, instance, validated_data):
            instance.username = validated_data.get('username', instance.username)
            instance.tagline = validated_data.get('tagline', instance.tagline)

            instance.save()

            password = validated_data.get('password', None)

            update_session_auth_hash(self.context.get('request'), instance)

            return instance
