from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from posts import views

urlpatterns = [
    url(r'^threads/$', views.ThreadList.as_view()),
    url(r'^threads/(?P<pk>[0-9]+)/$', views.ThreadDetail.as_view()),
    url(r'^users/$', views.UserList.as_view()),
    url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
