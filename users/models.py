from __future__ import unicode_literals
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.dispatch import receiver
from django.db.models.signals import post_save
from rest_framework.authtoken.models import Token
from intern import settings
from django.db import models

class UserAccountManager(BaseUserManager):
	def create_user(self, email, username, password):
		if not email:
			raise ValueError('Users must have a valid email address.')
		if not username:
			raise ValueError('Users must have a valid username')
		user = User.objects.create(email=email, username=username)
		user.set_password(password)
		user.save()
		return user

	def create_superuser(self, email, username, password):
		user = self.create_user(email, username, password)
		user.is_admin = True
		user.save()
		return user

class UserAccount(AbstractBaseUser):
    email = models.EmailField(unique=True, blank=False)
    username = models.CharField(max_length=16, unique=True, blank=False)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    is_admin = models.BooleanField(default=False)
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = UserAccountManager()
    def get_date(self):
	    return self.created_at
    def get_count(self):
	    return self.count
    def __str__(self):
	    return self.username
    def get_image(self):
	    return self.avatar
    def get_desc(self):
	    return self.description
    def get_full_name(self):
	    return self.full_name
    def get_short_name(self):
	    print('a')
    @property
    def is_superuser(self):
	    return self.is_admin
    @property
    def is_staff(self):
	    return self.is_admin
    def has_perms(self, obj=None):
	    return self.is_admin
    def has_perm(self, obj=None):
		return self.is_admin
    def has_module_perms(self, app_label):
	    return self.is_admin

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
