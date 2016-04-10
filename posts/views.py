from posts.models import Archive, Songs
from users.models import UserAccount
from posts.serializers import ArchiveSerializer, SongSerializer
from users.serializers import UserSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework.response import Response
from rest_framework import status, mixins, generics, permissions, renderers, viewsets
from posts.permissions import IsOwnerOrReadOnly

class CurrentUser(viewsets.ModelViewSet):
    queryset = UserAccount.objects.all()
    model = UserAccount
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def list(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

class ArchiveViewSet(viewsets.ModelViewSet):
    queryset = Archive.objects.all().order_by('-created')
    serializer_class = ArchiveSerializer

    def perform_create(self, serializer):
        return super(ArchiveViewSet, self).perform_create(serializer)

class Song(generics.GenericAPIView):
    queryset = Songs.objects.all()
    renderer_classes = (renderers.StaticHTMLRenderer,)

    def get(self, request, *args, **kwargs):
        song = self.get_object()
        return Response(song)

class SongByName(generics.ListCreateAPIView):
    """
    Holds the details of a single requested song.
    """
    serializer_class = SongSerializer

    def get_queryset(self):
        song = self.kwargs['song']
        return Songs.objects.filter(song=song)

class SongViewSet(viewsets.ModelViewSet):
    queryset = Songs.objects.all().order_by('created')
    serializer_class = SongSerializer

    def perform_create(self, serializer):
        return super(SongViewSet, self).perform_create(serializer)
