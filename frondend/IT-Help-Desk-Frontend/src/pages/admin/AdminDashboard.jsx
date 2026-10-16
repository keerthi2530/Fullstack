import { useEffect, useState } from "react";
import {
  Ticket,
  Clock3,
  CheckCircle2,
  CircleAlert,
  Users,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [supportUsers, setSupportUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [ticketResponse, supportResponse] = await Promise.all([
        api.get("/tickets/"),
        api.get("/auth/support-team/"),
      ]);

      setTickets(ticketResponse.data);
      setSupportUsers(supportResponse.data);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You do not have permission to view this dashboard.");
      } else {
        setError("Unable to load dashboard data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const closedTickets = tickets.filter(
    (ticket) => ticket.status === "Closed"
  ).length;

  const recentTickets = tickets.slice(0, 5);

  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return "status-open";

      case "In Progress":
        return "status-progress";

      case "Resolved":
        return "status-resolved";

      case "Closed":
        return "status-closed";

      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* Header */}

      <div className="admin-dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Monitor tickets, users and IT support activity.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchDashboardData}
        >
          Refresh
        </button>
      </div>

      {/* Error */}

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* Statistics */}

      <div className="admin-stats-grid">

        <div className="admin-stat-card">
          <div className="stat-icon total">
            <Ticket size={22} />
          </div>

          <div>
            <span>Total Tickets</span>
            <strong>{totalTickets}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon open">
            <CircleAlert size={22} />
          </div>

          <div>
            <span>Open Tickets</span>
            <strong>{openTickets}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon progress">
            <Clock3 size={22} />
          </div>

          <div>
            <span>In Progress</span>
            <strong>{inProgressTickets}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon resolved">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <span>Resolved</span>
            <strong>{resolvedTickets}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon closed">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <span>Closed</span>
            <strong>{closedTickets}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon support">
            <Users size={22} />
          </div>

          <div>
            <span>IT Support</span>
            <strong>{supportUsers.length}</strong>
          </div>
        </div>

      </div>

      {/* Main Content */}

      <div className="admin-dashboard-content">

        {/* Recent Tickets */}

        <div className="recent-tickets-card">

          <div className="section-header">
            <div>
              <h2>Recent Tickets</h2>
              <p>Latest tickets created in the system.</p>
            </div>

            <button
              onClick={() => navigate("/admin/tickets")}
              className="view-all-button"
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>

          {recentTickets.length === 0 ? (
            <div className="empty-state">
              <Ticket size={32} />
              <p>No tickets available.</p>
            </div>
          ) : (
            <div className="tickets-table-wrapper">

              <table className="admin-tickets-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ticket</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                  </tr>
                </thead>

                <tbody>

                  {recentTickets.map((ticket) => (
                    <tr key={ticket.id}>

                      <td>
                        <span className="ticket-id">
                          #{ticket.id}
                        </span>
                      </td>

                      <td>
                        <div className="ticket-title-cell">
                          <strong>{ticket.title}</strong>
                          <span>{ticket.category}</span>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`priority priority-${ticket.priority.toLowerCase()}`}
                        >
                          {ticket.priority}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`ticket-status ${getStatusClass(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                      </td>

                      <td>
                        {ticket.assigned_to_name ? (
                          <span className="assigned-user">
                            {ticket.assigned_to_name}
                          </span>
                        ) : (
                          <span className="not-assigned">
                            Not Assigned
                          </span>
                        )}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* Quick Actions */}

        <div className="quick-actions-card">

          <h2>Quick Actions</h2>

          <button
            onClick={() => navigate("/admin/tickets")}
            className="quick-action"
          >
            <div>
              <Ticket size={19} />
              <span>Manage Tickets</span>
            </div>

            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="quick-action"
          >
            <div>
              <Users size={19} />
              <span>Manage Users</span>
            </div>

            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => navigate("/admin/support-team")}
            className="quick-action"
          >
            <div>
              <Users size={19} />
              <span>IT Support Team</span>
            </div>

            <ArrowRight size={16} />
          </button>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;