from __future__ import unicode_literals

from django.db import models
from intern import settings


class Threads(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=42, blank=True, default=None)
    body = models.TextField()
    image = models.CharField(max_length=200)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='threads')

    def save(self, *args, **kwargs):
        options = self.title and {'title': self.title} or {}
        super(Threads, self).save(*args, **kwargs)

    class Meta:
        ordering = ('created',)

class Songs(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    song = models.CharField(max_length=72, unique=True, default=None, blank=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='songs')
    objects = models.Manager()

    def __str__(self):
        return self.song
        
    def save(self, *args, **kwargs):
        options = self.song and {'song': self.song} or {}
        super(Songs, self).save(*args, **kwargs)

    class Meta:
        ordering = ('-created',)
