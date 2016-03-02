from __future__ import unicode_literals

from django.db import models

class Thread(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=42, blank=True, default=None)
    image = models.CharField(max_length=200)
    owner = models.ForeignKey('auth.User', related_name='posts')

    def save(self, *args, **kwargs):
        options = self.title and {'title': self.title} or {}
        super(Thread, self).save(*args, **kwargs)
        
    class Meta:
        ordering = ('created',)
