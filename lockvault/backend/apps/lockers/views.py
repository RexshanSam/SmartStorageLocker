"""
Views for Locker model.
"""

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Locker
from .serializers import LockerSerializer
from apps.users.permissions import IsAdminRole


class LockerViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing lockers.
    - GET /api/lockers/ - List all lockers (with optional filters)
    - POST /api/lockers/ - Create locker [Admin only]
    - GET /api/lockers/<id>/ - Retrieve locker
    - PUT /api/lockers/<id>/ - Update locker [Admin only]
    - DELETE /api/lockers/<id>/ - Delete locker [Admin only]
    """

    queryset = Locker.objects.all()
    serializer_class = LockerSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        - Create: Admin only
        - Update/Delete: Admin only
        - List/Retrieve: Any authenticated user
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsAdminRole]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def list(self, request, *args, **kwargs):
        """List lockers with optional filters: status and size."""
        queryset = self.get_queryset()

        status_filter = request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        size_filter = request.query_params.get('size')
        if size_filter:
            queryset = queryset.filter(size=size_filter)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
