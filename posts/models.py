from __future__ import unicode_literals

from django.db import models
from intern import settings
from users.models import UserAccount
import datetime

class Archive(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    song = models.CharField(max_length=72, unique=False)
    upvotes = models.IntegerField(default=1)
    requester = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    title = models.CharField(default='Pre-update request', max_length=100)
    minutes = models.IntegerField(default='1')
    seconds = models.IntegerField(default='1')

    def __str__(self):
        return self.song

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
    start_time = models.DateTimeField(default=datetime.datetime.now())
    end_time = models.DateTimeField(default=datetime.datetime.now())
    minutes = models.IntegerField(default='1');
    seconds = models.IntegerField(default='1');
    title = models.CharField(default='None', max_length=100)
    requester = models.ForeignKey(UserAccount, on_delete=models.CASCADE)

    def __str__(self):
        return self.song

    def save(self, *args, **kwargs):
        options = self.song and {'song': self.song} or {}
        super(Songs, self).save(*args, **kwargs)

    class Meta:
        ordering = ('-created',)
