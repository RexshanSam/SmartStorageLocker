"""
Views for User authentication and management.
"""

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import get_user_model

from .serializers import RegisterSerializer, LoginSerializer, UserProfileSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """Register a new user and return JWT tokens."""

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT tokens
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        # Return user data with tokens
        from .serializers import UserProfileSerializer
        return Response({
            'user': UserProfileSerializer(user).data,
            'refresh': str(refresh),
            'access': str(access),
        }, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    """Login user and return JWT tokens."""

    serializer_class = LoginSerializer


class RefreshTokenView(TokenRefreshView):
    """Refresh access token using refresh token."""

    pass


class MeView(generics.RetrieveUpdateAPIView):
    """Get current user profile."""

    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
