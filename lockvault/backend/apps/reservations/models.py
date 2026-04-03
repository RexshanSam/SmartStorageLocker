"""
Reservation model for locker bookings.
"""

from django.db import models
from django.utils import timezone
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from apps.users.models import User
from apps.lockers.models import Locker


class Reservation(models.Model):
    """Reservation model representing a locker booking."""

    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        RELEASED = 'released', 'Released'
        EXPIRED = 'expired', 'Expired'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations')
    locker = models.OneToOneField(
        Locker,
        on_delete=models.CASCADE,
        related_name='reservation',
    )
    reserved_from = models.DateTimeField()
    reserved_until = models.DateTimeField()
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.ACTIVE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-reserved_from']
        unique_together = ['locker', 'status']  # Ensures only one active reservation per locker

    def __str__(self):
        return f"Reservation {self.id} - {self.locker.locker_number} by {self.user.email}"

    def clean(self):
        """Validate reservation dates."""
        from django.core.exceptions import ValidationError

        if self.reserved_until <= self.reserved_from:
            raise ValidationError("reserved_until must be after reserved_from.")

        # Convert naive datetimes to aware for comparison
        reserved_from = self.reserved_from
        if timezone.is_naive(reserved_from):
            reserved_from = timezone.make_aware(reserved_from)

        if reserved_from < timezone.now():
            raise ValidationError("Cannot create reservation in the past.")

    def save(self, *args, **kwargs):
        """Override save to update locker status."""
        # Call clean for validation
        self.full_clean()

        # Ensure only one active reservation per locker
        if self.status == self.Status.ACTIVE:
            # Expire any existing active reservations for this locker
            Reservation.objects.filter(
                locker=self.locker,
                status=self.Status.ACTIVE
            ).exclude(pk=self.pk if self.pk else None).update(status=self.Status.EXPIRED)

        super().save(*args, **kwargs)

    def is_expired(self):
        """Check if reservation has expired."""
        return timezone.now() > self.reserved_until


@receiver(post_save, sender=Reservation)
def update_locker_status_on_reservation_save(sender, instance, created, **kwargs):
    """
    Update locker status when a reservation is created/updated.
    """
    locker = instance.locker

    if instance.status == Reservation.Status.ACTIVE:
        locker.status = Locker.Status.RESERVED
    elif instance.status in [Reservation.Status.RELEASED, Reservation.Status.EXPIRED]:
        # Check if there are other active reservations for this locker
        has_active = Reservation.objects.filter(
            locker=locker,
            status=Reservation.Status.ACTIVE
        ).exists()
        if not has_active:
            locker.status = Locker.Status.AVAILABLE

    locker.save()


@receiver(post_delete, sender=Reservation)
def update_locker_status_on_reservation_delete(sender, instance, **kwargs):
    """
    Update locker status when a reservation is deleted.
    """
    locker = instance.locker

    # Check if there are any other active reservations for this locker
    has_active = Reservation.objects.filter(
        locker=locker,
        status=Reservation.Status.ACTIVE
    ).exists()

    if not has_active:
        locker.status = Locker.Status.AVAILABLE
        locker.save()
