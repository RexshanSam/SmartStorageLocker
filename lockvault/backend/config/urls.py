"""
URL configuration for LockVault project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# Import the Locker model to seed initial data
from apps.lockers.models import Locker

urlpatterns = [
    path('admin/', admin.site.urls),

    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Authentication endpoints
    path('api/auth/', include('apps.users.urls')),

    # Lockers endpoints
    path('api/lockers/', include('apps.lockers.urls')),

    # Reservations endpoints
    path('api/reservations/', include('apps.reservations.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# SEEDING SCRIPT: This runs when Render boots the app up
try:
    # Check if there are any lockers in your database
    if not Locker.objects.exists():
        Locker.objects.create(locker_id="LKR-001", status="available", size="medium")
        Locker.objects.create(locker_id="LKR-002", status="available", size="large")
        print("SUCCESS: Seeded 2 test lockers into the database!")
    else:
        print("Lockers already exist in the database.")
except Exception as e:
    print("Could not seed lockers:", e)
