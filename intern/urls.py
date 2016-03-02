from django.conf.urls import url, include
from rest_framework import routers
from users import views
from django.contrib import admin

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^', include('posts.urls')),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]