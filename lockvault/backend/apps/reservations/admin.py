"""
Admin configuration for Reservations app.
"""

from django.contrib import admin

from .models import Reservation


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'locker', 'reserved_from', 'reserved_until', 'status')
    list_filter = ('status', 'reserved_from', 'reserved_until')
    search_fields = ('user__email', 'locker__locker_number')
    ordering = ('-reserved_from',)
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        ('Reservation Info', {
            'fields': ('user', 'locker', 'reserved_from', 'reserved_until', 'status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
