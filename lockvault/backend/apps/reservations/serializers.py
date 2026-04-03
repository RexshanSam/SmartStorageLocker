"""
Serializers for Reservation model.
"""

from rest_framework import serializers
from django.utils import timezone
from django.db import transaction

from .models import Reservation
from apps.lockers.models import Locker


class ReservationSerializer(serializers.ModelSerializer):
    """Serializer for creating and viewing reservations."""

    user = serializers.PrimaryKeyRelatedField(read_only=True)
    locker = serializers.PrimaryKeyRelatedField(queryset=Locker.objects.all())
    locker_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Reservation
        fields = ['id', 'user', 'locker', 'locker_details', 'reserved_from', 'reserved_until', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'status', 'created_at', 'updated_at']

    def get_locker_details(self, obj):
        """Return locker details for display."""
        return {
            'locker_number': obj.locker.locker_number,
            'location': obj.locker.location,
            'size': obj.locker.size,
        }

    def validate(self, attrs):
        """Validate reservation dates and locker availability."""
        reserved_from = attrs.get('reserved_from')
        reserved_until = attrs.get('reserved_until')
        locker = attrs.get('locker')

        # Check if dates are provided
        if not reserved_from or not reserved_until:
            raise serializers.ValidationError("Both reserved_from and reserved_until are required.")

        # Convert naive datetimes to aware if needed (frontend sends naive)
        if timezone.is_naive(reserved_from):
            reserved_from = timezone.make_aware(reserved_from)
        if timezone.is_naive(reserved_until):
            reserved_until = timezone.make_aware(reserved_until)

        # Check if reservation is in the past
        if reserved_from < timezone.now():
            raise serializers.ValidationError({"reserved_from": "Cannot create reservation in the past."})

        # Check if reserved_until is after reserved_from
        if reserved_until <= reserved_from:
            raise serializers.ValidationError({"reserved_until": "reserved_until must be after reserved_from."})

        # Check maximum reservation duration (30 days)
        max_duration = timezone.timedelta(days=30)
        if reserved_until - reserved_from > max_duration:
            raise serializers.ValidationError({"reserved_until": "Maximum reservation duration is 30 days."})

        # Check if locker is available
        if locker.status != Locker.Status.AVAILABLE:
            raise serializers.ValidationError({"locker": f"Locker is currently {locker.status}."})

        # Check for overlapping reservations (race condition protection)
        overlapping = Reservation.objects.filter(
            locker=locker,
            status=Reservation.Status.ACTIVE,
            reserved_from__lt=reserved_until,
            reserved_until__gt=reserved_from,
        ).exists()

        if overlapping:
            raise serializers.ValidationError({"locker": "Locker is already reserved for this time period."})

        # Update attrs with aware datetimes for use in create
        attrs['reserved_from'] = reserved_from
        attrs['reserved_until'] = reserved_until
        return attrs

    def create(self, validated_data):
        """Create a new reservation for the current user."""
        user = self.context['request'].user
        with transaction.atomic():
            reservation = Reservation.objects.create(user=user, **validated_data)
            return reservation


class ReservationReleaseSerializer(serializers.Serializer):
    """Serializer for releasing a reservation."""

    reason = serializers.CharField(required=False, allow_blank=True, max_length=200)
