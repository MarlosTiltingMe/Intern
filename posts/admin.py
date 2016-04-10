from django.contrib import admin
from .models import Songs, Archive


class ArchiveAdmin(admin.ModelAdmin):
    list_display = ('song')

class SongsAdmin(admin.ModelAdmin):
    list_display = ('song')

admin.site.register(Songs)
admin.site.register(Archive)
