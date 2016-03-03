from __future__ import unicode_literals

from django.db import models

class Threads(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=42, blank=True, default=None)
    body = models.TextField()
    image = models.CharField(max_length=200)
    owner = models.ForeignKey('auth.User', related_name='threads')

    def save(self, *args, **kwargs):
        options = self.title and {'title': self.title} or {}
        super(Thread, self).save(*args, **kwargs)

    class Meta:
        ordering = ('created',)
