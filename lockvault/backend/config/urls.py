"""
URL configuration for LockVault project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

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


from django.contrib.auth import get_user_model
try:
    User = get_user_model()
    emails = [user.email for user in User.objects.all()]
    print("CRITICAL_DATABASE_EMAILS:", emails)
except Exception as e:
    print("Could not fetch emails:", e)
