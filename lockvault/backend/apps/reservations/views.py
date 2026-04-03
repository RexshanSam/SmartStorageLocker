"""
Views for Reservation model.
"""

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Reservation
from .serializers import ReservationSerializer
from apps.lockers.models import Locker


class ReservationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for reservation management.
    - GET /api/reservations/ - List reservations (Admin=all, User=own)
    - POST /api/reservations/ - Create reservation
    - GET /api/reservations/<id>/ - Retrieve reservation
    - PUT/PATCH /api/reservations/<id>/ - Update reservation
    - DELETE /api/reservations/<id>/ - Delete reservation
    - PUT /api/reservations/<id>/release/ - Release reservation (custom action)
    """

    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Reservation.objects.all().order_by('-created_at')
        return Reservation.objects.filter(user=user).order_by('-created_at')

    def perform_create(self, serializer):
        """
        Create a new reservation and update locker status.
        """
        locker_id = self.request.data.get('locker')
        try:
            locker = Locker.objects.get(id=locker_id)
        except Locker.DoesNotExist:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'locker': 'Locker does not exist.'})

        # Check if locker is available
        if locker.status != Locker.Status.AVAILABLE:
            raise ValidationError({'locker': f'Locker is currently {locker.status}.'})

        # Check for overlapping reservations (just in case)
        reserved_from = serializer.validated_data.get('reserved_from')
        reserved_until = serializer.validated_data.get('reserved_until')
        overlapping = Reservation.objects.filter(
            locker=locker,
            status=Reservation.Status.ACTIVE,
            reserved_from__lt=reserved_until,
            reserved_until__gt=reserved_from,
        ).exists()

        if overlapping:
            raise ValidationError({'locker': 'This locker is already reserved for the selected time period.'})

        # Save the reservation (serializer.create handles user assignment)
        reservation = serializer.save()

        # Update locker status to reserved
        locker.status = Locker.Status.RESERVED
        locker.save()

    def perform_update(self, serializer):
        """
        Update a reservation. Only allow status changes by admin.
        """
        # For now, disallow updates via PUT/PATCH except by admin
        if self.request.user.role != 'admin':
            return Response(
                {'detail': 'You do not have permission to update reservations.'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save()

    def perform_destroy(self, instance):
        """
        Delete a reservation. Only admin can delete.
        """
        if self.request.user.role != 'admin':
            return Response(
                {'detail': 'You do not have permission to delete reservations.'},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.delete()

    @action(detail=True, methods=['put', 'patch'], url_path='release')
    def release(self, request, pk=None):
        """
        Release a reservation. Changes status to 'released' and updates locker to 'available'.
        """
        reservation = self.get_object()

        # Check permissions: only owner or admin can release
        if request.user != reservation.user and request.user.role != 'admin':
            return Response(
                {'detail': 'You do not have permission to release this reservation.'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if reservation is active
        if reservation.status != 'active':
            return Response(
                {'detail': 'Only active reservations can be released.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Release the reservation
        reservation.status = 'released'
        reservation.save()

        # Update locker status back to available
        locker = reservation.locker
        locker.status = 'available'
        locker.save()

        return Response(
            self.get_serializer(reservation).data,
            status=status.HTTP_200_OK
        )
