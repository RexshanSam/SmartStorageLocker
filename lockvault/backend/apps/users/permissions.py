"""
Custom permission classes for LockVault.
"""

from rest_framework import permissions


class IsAdminRole(permissions.BasePermission):
    """
    Permission to allow only users with admin role.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'
