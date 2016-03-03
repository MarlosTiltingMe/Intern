from django.conf.urls import url, include
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns
from users.views import UserViewSet
from posts import views
from django.contrib import admin
from intern.views import IndexView

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'threads', views.ThreadViewSet)

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api-auth/', include('rest_framework.urls',
                                namespace='rest_framework')),
    url(r'^api/', include(router.urls)),
    url(r'^api/threads/$',
        views.ThreadList.as_view(),
        name='thread-list'),
    url(r'^api/threads/(?P<pk>[0-9]+)/$',
        views.ThreadDetail.as_view(),
        name='thread-detail'),
    url(r'^api/users/$',
        views.UserList.as_view(),
        name='user-list'),
    url(r'^api/users/(?P<pk>[0-9]+)/$',
        views.UserDetail.as_view(),
        name='user-detail'),
    url(r'^.*$', IndexView.as_view(), name='index'),
]
