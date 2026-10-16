from django.urls import path

from .views import (
    LoginView,
    SupportUsersView,
)

from django.urls import path

from .views import (
    LoginView,
    SupportUsersView,
    UsersView,
    SupportTeamView,
)

urlpatterns = [
    path(
        "login/",
        LoginView.as_view(),
        name="login"
    ),

    path(
        "support-users/",
        SupportUsersView.as_view(),
        name="support-users"
    ),

    path(
        "users/",
        UsersView.as_view(),
        name="users"
    ),

    path(
    "support-team/",
    SupportTeamView.as_view(),
    name="support-team"
),
]