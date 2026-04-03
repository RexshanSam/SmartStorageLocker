"""
Serializers for Locker model.
"""

from rest_framework import serializers
from .models import Locker


class LockerSerializer(serializers.ModelSerializer):
    """Serializer for Locker model."""

    class Meta:
        model = Locker
        fields = ['id', 'locker_number', 'location', 'size', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_locker_number(self, value):
        if not value.strip():
            raise serializers.ValidationError("Locker number cannot be empty.")
        return value
