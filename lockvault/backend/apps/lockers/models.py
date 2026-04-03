"""
Locker model for storage lockers.
"""

from django.db import models


class Locker(models.Model):
    """Locker model representing a physical storage locker."""

    class Size(models.TextChoices):
        SMALL = 'small', 'Small'
        MEDIUM = 'medium', 'Medium'
        LARGE = 'large', 'Large'

    class Status(models.TextChoices):
        AVAILABLE = 'available', 'Available'
        RESERVED = 'reserved', 'Reserved'
        MAINTENANCE = 'maintenance', 'Maintenance'

    locker_number = models.CharField(max_length=50, unique=True)
    location = models.CharField(max_length=200)
    size = models.CharField(
        max_length=10,
        choices=Size.choices,
        default=Size.MEDIUM,
    )
    status = models.CharField(
        max_length=15,
        choices=Status.choices,
        default=Status.AVAILABLE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Locker {self.locker_number} - {self.location} ({self.size})"
