import { useEffect, useState } from "react";
import {
  Search,
  UserRound,
  ShieldCheck,
  Wrench,
  UserCheck,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";
import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/auth/users/");

      setUsers(response.data);
    } catch (error) {
      console.error("Users error:", error);

      setError(
        error.response?.data?.detail ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.username.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText) ||
      user.role.toLowerCase().includes(searchText)
    );
  });

  const getRoleIcon = (role) => {
    if (role === "admin") {
      return <ShieldCheck size={18} />;
    }

    if (role === "support") {
      return <Wrench size={18} />;
    }

    return <UserRound size={18} />;
  };

  const getRoleName = (role) => {
    if (role === "admin") return "Administrator";
    if (role === "support") return "IT Support";
    return "Employee";
  };

  return (
    <div className="users-page">

      {/* Header */}
      <div className="users-heading">

        <div>
          <h1>User Management</h1>

          <p>
            Manage employees, IT support members and administrators.
          </p>
        </div>

        <div className="users-count">
          <UserCheck size={18} />
          {users.length} Users
        </div>

      </div>

      {/* Search */}
      <div className="users-toolbar">

        <div className="user-search">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

      {/* Loading */}
      {loading && (
        <div className="users-message">
          Loading users...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="users-message error">
          <AlertCircle size={22} />
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        filteredUsers.length === 0 && (
          <div className="users-message">
            <UserRound size={40} />

            <h3>No users found</h3>

            <p>
              Try searching with a different keyword.
            </p>
          </div>
        )}

      {/* Users table */}
      {!loading &&
        !error &&
        filteredUsers.length > 0 && (

          <div className="users-card">

            <div className="users-table-header">
              <span>User</span>
              <span>Email</span>
              <span>Role</span>
              <span>Status</span>
            </div>

            {filteredUsers.map((user) => (

              <div
                className="users-table-row"
                key={user.id}
              >

                {/* User */}
                <div className="user-info">

                  <div className="user-avatar">
                    {user.username
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {user.username}
                    </strong>

                    <small>
                      User ID: #{user.id}
                    </small>
                  </div>

                </div>

                {/* Email */}
                <span className="user-email">
                  {user.email}
                </span>

                {/* Role */}
                <span
                  className={`user-role ${user.role}`}
                >
                  {getRoleIcon(user.role)}
                  {getRoleName(user.role)}
                </span>

                {/* Status */}
                <span
                  className={`user-status ${
                    user.is_active
                      ? "active"
                      : "inactive"
                  }`}
                >
                  {user.is_active
                    ? "Active"
                    : "Inactive"}
                </span>

              </div>

            ))}

          </div>

        )}

    </div>
  );
}

export default Users;