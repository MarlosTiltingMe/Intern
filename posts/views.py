from posts.models import Threads
from posts.serializers import ThreadSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework.response import Response
from rest_framework import status, mixins, generics, permissions, renderers, viewsets
from django.contrib.auth.models import User
from posts.permissions import IsOwnerOrReadOnly

class ThreadList(generics.ListCreateAPIView):
    """
    List all threads, homie
    """
    queryset = Threads.objects.all()
    serializer_class = ThreadSerializer

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ThreadDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Get/Maniupulate a single thread.
    """
    queryset = Threads.objects.all()
    serializer_class = ThreadSerializer

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

class Thread(generics.GenericAPIView):
    queryset = Threads.objects.all()
    renderer_classes = (renderers.StaticHTMLRenderer,)

    def get(self, request, *args, **kwargs):
        thread = self.get_object()
        return Response(thread)

class ThreadViewSet(viewsets.ModelViewSet):
    queryset = Threads.objects.all().order_by('-created')
    serializer_class = ThreadSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        return super(ThreadViewSet, self).perform_create(serializer)


@api_view(('GET',))
def api_root(request, format=None):
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'posts': reverse('thread-list', request=request, format=format),
        'boards': reverse('board-list', request=request, format=format)
    })
