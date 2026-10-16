from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Comment
from .serializers import CommentSerializer
from django.db import models
from .models import Ticket
from .serializers import TicketSerializer


class TicketViewSet(viewsets.ModelViewSet):

    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_role(self):
        user = self.request.user

        if user.is_superuser:
            return "admin"

        try:
            return user.profile.role
        except Exception:
            return "employee"

    def get_queryset(self):
        user = self.request.user
        role = self.get_role()

        if role == "employee":
            return Ticket.objects.filter(
                created_by=user
            ).order_by("-created_at")

        if role == "support":
            return Ticket.objects.filter(
                assigned_to=user
            ).order_by("-created_at")

        if role == "admin":
            return Ticket.objects.all().order_by(
                "-created_at"
            )

        return Ticket.objects.none()

    def perform_create(self, serializer):
        role = self.get_role()

        if role != "employee":
            raise PermissionDenied(
                "Only employees can create tickets."
            )

        serializer.save(
            created_by=self.request.user,
            status="Open"
        )



    def perform_destroy(self, instance):
        role = self.get_role()

        if role != "admin":
            raise PermissionDenied(
                "Only administrators can delete tickets."
            )

        instance.delete()

class CommentViewSet(viewsets.ModelViewSet):

    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        queryset = Comment.objects.filter(
            models.Q(ticket__created_by=user) |
            models.Q(ticket__assigned_to=user)
        ).select_related(
            "user",
            "ticket"
        ).order_by("created_at")

        ticket_id = self.request.query_params.get("ticket")

        if ticket_id:
            queryset = queryset.filter(
                ticket_id=ticket_id
            )

        return queryset

    def perform_create(self, serializer):

        ticket_id = self.request.data.get("ticket")

        try:
            ticket = Ticket.objects.get(
                id=ticket_id
            )
        except Ticket.DoesNotExist:
            raise PermissionDenied(
                "Ticket does not exist."
            )

        user = self.request.user

        # Only employee who created the ticket
        # or assigned support user can comment.
        if (
            ticket.created_by != user
            and ticket.assigned_to != user
            and not user.is_superuser
        ):
            raise PermissionDenied(
                "You do not have permission to comment on this ticket."
            )

        serializer.save(
            ticket=ticket,
            user=user
        )
def get_queryset(self):

    user = self.request.user

    queryset = Comment.objects.filter(
        models.Q(ticket__created_by=user) |
        models.Q(ticket__assigned_to=user)
    ).select_related(
        "user",
        "ticket"
    ).order_by("created_at")

    ticket_id = self.request.query_params.get(
        "ticket"
    )

    if ticket_id:
        queryset = queryset.filter(
            ticket_id=ticket_id
        )


def perform_update(self, serializer):
    role = self.get_role()
    ticket = self.get_object()

    if role == "employee":
        new_status = self.request.data.get("status")

        # Employee can only close a resolved ticket
        if new_status == "Closed":
            if ticket.status != "Resolved":
                raise PermissionDenied(
                    "Only resolved tickets can be closed."
                )

            serializer.save(
                created_by=ticket.created_by,
                assigned_to=ticket.assigned_to,
                priority=ticket.priority,
                status="Closed"
            )
            return

        # Employee cannot change other ticket fields/status
        serializer.save(
            created_by=ticket.created_by,
            assigned_to=ticket.assigned_to,
            priority=ticket.priority,
            status=ticket.status
        )

    elif role == "support":
        new_status = self.request.data.get("status")

        # Support workflow
        if new_status == "In Progress":
            if ticket.status != "Open":
                raise PermissionDenied(
                    "Only open tickets can be moved to In Progress."
                )

        elif new_status == "Resolved":
            if ticket.status != "In Progress":
                raise PermissionDenied(
                    "Only tickets in progress can be resolved."
                )

        elif new_status is not None and new_status != ticket.status:
            raise PermissionDenied(
                "Invalid status change."
            )

        serializer.save(
            created_by=ticket.created_by,
            assigned_to=ticket.assigned_to,
            priority=ticket.priority
        )

    elif role == "admin":
        serializer.save(
            created_by=ticket.created_by
        )

    else:
        raise PermissionDenied(
            "You do not have permission."
        )       

    return queryset