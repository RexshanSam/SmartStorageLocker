"""
URL patterns for Lockers app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LockerViewSet

router = DefaultRouter()
router.register(r'', LockerViewSet, basename='locker')

urlpatterns = [
    path('', include(router.urls)),
]
