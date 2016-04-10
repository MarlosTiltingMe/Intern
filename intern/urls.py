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
router.register(r'archives', views.ArchiveViewSet)
router.register(r'songs', views.SongViewSet)
router.register(r'current', views.CurrentUser)


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
    url(r'^api/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^.*$', IndexView.as_view(), name='index'),
]
