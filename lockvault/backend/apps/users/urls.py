"""
URL patterns for Users app.
"""

from django.urls import path
from .views import RegisterView, LoginView, RefreshTokenView, MeView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', RefreshTokenView.as_view(), name='refresh'),
    path('me/', MeView.as_view(), name='me'),
]
