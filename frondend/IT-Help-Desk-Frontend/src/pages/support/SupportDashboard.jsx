import { useEffect, useState } from "react";
import {
  Ticket,
  Clock3,
  CheckCircle2,
  CircleAlert,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import "./SupportDashboard.css";

function SupportDashboard() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tickets/");

      setTickets(response.data);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You do not have permission to view these tickets.");
      } else {
        setError("Unable to load assigned tickets.");
      }
    } finally {
      setLoading(false);
    }
  };

  const assignedTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) =>
      ticket.status === "Resolved" ||
      ticket.status === "Closed"
  ).length;

  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return "support-status-open";

      case "In Progress":
        return "support-status-progress";

      case "Resolved":
        return "support-status-resolved";

      case "Closed":
        return "support-status-closed";

      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="support-loading">
        <div className="support-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="support-dashboard">

      {/* Header */}

      <div className="support-dashboard-header">
        <div>
          <h1>IT Support Dashboard</h1>

          <p>
            Welcome back,{" "}
            <strong>
              {user?.username || "Support Team"}
            </strong>
            . Here are your assigned tickets.
          </p>
        </div>

        <button
          className="support-refresh-button"
          onClick={fetchTickets}
        >
          Refresh
        </button>
      </div>

      {/* Error */}

      {error && (
        <div className="support-error">
          {error}
        </div>
      )}

      {/* Statistics */}

      <div className="support-stats-grid">

        <div className="support-stat-card">
          <div className="support-stat-icon assigned">
            <Ticket size={22} />
          </div>

          <div>
            <span>Assigned Tickets</span>
            <strong>{assignedTickets}</strong>
          </div>
        </div>

        <div className="support-stat-card">
          <div className="support-stat-icon open">
            <CircleAlert size={22} />
          </div>

          <div>
            <span>Open</span>
            <strong>{openTickets}</strong>
          </div>
        </div>

        <div className="support-stat-card">
          <div className="support-stat-icon progress">
            <Clock3 size={22} />
          </div>

          <div>
            <span>In Progress</span>
            <strong>{inProgressTickets}</strong>
          </div>
        </div>

        <div className="support-stat-card">
          <div className="support-stat-icon resolved">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <span>Resolved / Closed</span>
            <strong>{resolvedTickets}</strong>
          </div>
        </div>

      </div>

      {/* Assigned Tickets */}

      <div className="support-tickets-card">

        <div className="support-section-header">
          <div>
            <h2>My Assigned Tickets</h2>
            <p>
              Tickets currently assigned to you.
            </p>
          </div>

          <button
            className="support-view-all"
            onClick={() => navigate("/support/tickets")}
          >
            View All
            <ArrowRight size={16} />
          </button>
        </div>

        {tickets.length === 0 ? (
          <div className="support-empty-state">
            <Ticket size={35} />

            <h3>No tickets assigned</h3>

            <p>
              You currently don't have any tickets assigned to you.
            </p>
          </div>
        ) : (
          <div className="support-ticket-list">

            {tickets.slice(0, 5).map((ticket) => (
              <div
                key={ticket.id}
                className="support-ticket-row"
                onClick={() =>
                  navigate(`/support/tickets/${ticket.id}`)
                }
              >

                <div className="support-ticket-main">

                  <span className="support-ticket-id">
                    #{ticket.id}
                  </span>

                  <div>
                    <h3>{ticket.title}</h3>

                    <p>
                      {ticket.category} ·{" "}
                      {ticket.priority} Priority
                    </p>
                  </div>

                </div>

                <div className="support-ticket-right">

                  <span
                    className={`support-ticket-status ${getStatusClass(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>

                  <ArrowRight size={17} />

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default SupportDashboard;