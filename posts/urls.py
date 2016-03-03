from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from posts import views

urlpatterns = [

]
urlpatterns += [
    url(r'^api-auth/', include('rest_framework.urls',
                               namespace='rest_framework')),
]
