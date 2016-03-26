from django.conf.urls import url, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.urlpatterns import format_suffix_patterns
from users.views import AccountViewSet, UserViewSet, UserDetail, UserByName, LoginView, LogoutView
from posts import views
from django.contrib import admin
from intern.views import IndexView

router = routers.DefaultRouter()
router.register(r'users', AccountViewSet)
router.register(r'Archives', views.ArchiveViewSet)
router.register(r'songs', views.SongViewSet)
router.register(r'test', views.TestViewSet)


user_list = UserViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

user_detail = UserViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'post': 'create'
})

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include(router.urls)),
    url(r'^api/users/$', user_list, name='user-list'),
    url(r'^api/users/(?P<pk>[0-9]+)/$', user_detail, name='user-detail'),
    url(r'^api/Archives/$',
        views.ArchiveList.as_view(),
        name='Archive-list'),
    url(r'^api/Archives/(?P<pk>[0-9]+)/$',
        views.ArchiveDetail.as_view(),
        name='Archive-detail'),
    url(r'^api/users/(?P<pk>[0-9]+)/$',
        UserDetail.as_view(),
        name='user-detail'),
    url(r'^api/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'api/user/(?P<username>.+)/$',
        UserByName.as_view()),
    url(r'^api/songs/$',
        views.SongList.as_view(),
        name='song-list'),
    url(r'^.*$', IndexView.as_view(), name='index'),
]
