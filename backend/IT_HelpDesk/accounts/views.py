from django.contrib.auth.models import User

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import (
    LoginSerializer,
    SupportUserSerializer,
    UserListSerializer,
    SupportTeamSerializer,
)

class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            return Response(
                serializer.validated_data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class SupportUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        try:
            role = request.user.profile.role
        except Exception:
            role = None

        print("Logged in user:", request.user.username)
        print("User role:", role)

        if not request.user.is_superuser and role != "admin":
            return Response(
                {
                    "detail": "Only administrators can view IT support users."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        users = User.objects.filter(
            profile__role="support"
        ).order_by("username")

        print("Support users:", list(
            users.values(
                "id",
                "username",
                "email"
            )
        ))

        serializer = SupportUserSerializer(
            users,
            many=True
        )

        return Response(serializer.data)

class UsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser:
            try:
                if request.user.profile.role != "admin":
                    return Response(
                        {"detail": "Only administrators can view users."},
                        status=status.HTTP_403_FORBIDDEN
                    )
            except Exception:
                return Response(
                    {"detail": "Only administrators can view users."},
                    status=status.HTTP_403_FORBIDDEN
                )

        users = User.objects.select_related(
            "profile"
        ).all().order_by("username")

        serializer = UserListSerializer(
            users,
            many=True
        )

        return Response(serializer.data)
class SupportTeamView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Only admin can access support team
        if not request.user.is_superuser:
            try:
                if request.user.profile.role != "admin":
                    return Response(
                        {"detail": "Only administrators can view the support team."},
                        status=status.HTTP_403_FORBIDDEN
                    )
            except UserProfile.DoesNotExist:
                return Response(
                    {"detail": "Only administrators can view the support team."},
                    status=status.HTTP_403_FORBIDDEN
                )

        support_users = User.objects.filter(
            profile__role="support"
        ).select_related(
            "profile"
        ).order_by("username")

        serializer = SupportTeamSerializer(
            support_users,
            many=True
        )

        return Response(serializer.data)