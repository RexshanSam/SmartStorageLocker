"""
Serializers for User authentication and management.
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""

    password = serializers.CharField(write_only=True, min_length=8)
    
    # CHANGED: Added required=False so it doesn't fail if the frontend skips sending it
    password_confirm = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'password_confirm', 'role']

    def validate(self, attrs):
        # CHANGED: Only validate match if the frontend actually sent the confirmation field
        pw_confirm = attrs.get('password_confirm')
        if pw_confirm and attrs['password'] != pw_confirm:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        # Use pop with None to prevent KeyErrors if the field wasn't sent
        validated_data.pop('password_confirm', None)
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(TokenObtainPairSerializer):
    """Serializer for user login with JWT tokens."""

    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({
            'user': {
                'id': self.user.id,
                'email': self.user.email,
                'name': self.user.name,
                'role': self.user.role,
            }
        })
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
