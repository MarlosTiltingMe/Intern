from django.contrib import admin
from .models import UserAccount

class UserAccountAdmin(admin.ModelAdmin):
    list_display = ('username', 'is_admin')
admin.site.register(UserAccount)
