from __future__ import unicode_literals

from django.db import models
from intern import settings


class Archive(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    song = models.CharField(max_length=72, unique=False)

    def save(self, *args, **kwargs):
        options = self.song and {'song': self.song} or {}
        super(Archive, self).save(*args, **kwargs)

    class Meta:
        ordering = ('created',)

class Songs(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    song = models.CharField(max_length=72, unique=True)
    objects = models.Manager()
    upvotes = models.IntegerField(default=1)

    def __str__(self):
        return self.song

    def save(self, *args, **kwargs):
        options = self.song and {'song': self.song} or {}
        super(Songs, self).save(*args, **kwargs)

    class Meta:
        ordering = ('-created',)
