"""
Admin configuration for Lockers app.
"""

from django.contrib import admin
from .models import Locker


@admin.register(Locker)
class LockerAdmin(admin.ModelAdmin):
    list_display = ('locker_number', 'location', 'size', 'status')
    list_filter = ('size', 'status')
    search_fields = ('locker_number', 'location')
    ordering = ('locker_number',)
