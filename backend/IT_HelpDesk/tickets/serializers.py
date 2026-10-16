from rest_framework import serializers
from .models import Ticket, Comment


class TicketSerializer(serializers.ModelSerializer):

    created_by_name = serializers.CharField(
        source="created_by.username",
        read_only=True
    )

    assigned_to_name = serializers.CharField(
        source="assigned_to.username",
        read_only=True
    )

    class Meta:
        model = Ticket

        fields = [
            "id",
            "title",
            "description",
            "category",
            "priority",
            "status",
            "created_by",
            "created_by_name",
            "assigned_to",
            "assigned_to_name",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_by",
            "created_by_name",
            "assigned_to_name",
            "created_at",
            "updated_at",
        ]


class CommentSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    class Meta:
        model = Comment

        fields = [
            "id",
            "ticket",
            "user",
            "username",
            "message",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "username",
            "created_at",
        ]