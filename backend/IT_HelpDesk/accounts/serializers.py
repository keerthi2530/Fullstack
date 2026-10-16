from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserProfile


class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True
    )

    def validate(self, attrs):

        email = attrs.get("email")
        password = attrs.get("password")

        user = User.objects.filter(
            email__iexact=email
        ).first()

        if user is None:
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        if not user.check_password(password):
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "This account is inactive."
            )

        if user.is_superuser:
            role = "admin"
        else:
            try:
                role = user.profile.role
            except UserProfile.DoesNotExist:
                role = "employee"

        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": role,
            },
        }


class SupportUserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(
        source="profile.role",
        read_only=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "role",
        ]

class UserListSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "role",
            "is_active",
        ]

    def get_role(self, obj):
        if obj.is_superuser:
            return "admin"

        try:
            return obj.profile.role
        except UserProfile.DoesNotExist:
            return "employee"
class SupportTeamSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    assigned_tickets = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "role",
            "is_active",
            "assigned_tickets",
        ]

    def get_role(self, obj):
        return "support"

    def get_assigned_tickets(self, obj):
        return obj.assigned_tickets.count()