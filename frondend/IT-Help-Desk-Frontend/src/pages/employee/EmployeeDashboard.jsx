import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowUpRight,
} from "lucide-react";

import api from "../../services/api";
import "./EmployeeDashboard.css";

function EmployeeDashboard() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tickets/");

      setTickets(response.data);
    } catch (error) {
      console.error("Employee dashboard error:", error);

      setError(
        error.response?.data?.detail ||
          "Unable to load your tickets."
      );
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
    (ticket) =>
      ticket.status === "Resolved" ||
      ticket.status === "Closed"
  ).length;

  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="employee-dashboard">

      {/* Header */}
      <div className="dashboard-heading">
        <div>
          <h1>Employee Dashboard 👋</h1>
          <p>
            Track your IT support requests and their progress.
          </p>
        </div>

        <button
          className="create-ticket-btn"
          onClick={() => navigate("/employee/create-ticket")}
        >
          <Plus size={18} />
          Create Ticket
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon blue">
            <Ticket size={21} />
          </div>

          <div>
            <span>Total Tickets</span>
            <h2>{totalTickets}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <AlertCircle size={21} />
          </div>

          <div>
            <span>Open</span>
            <h2>{openTickets}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Clock3 size={21} />
          </div>

          <div>
            <span>In Progress</span>
            <h2>{inProgressTickets}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Resolved</span>
            <h2>{resolvedTickets}</h2>
          </div>
        </div>

      </div>

      {/* Recent Tickets */}
      <div className="tickets-card">

        <div className="card-header">
          <div>
            <h2>My Recent Tickets</h2>
            <p>Your latest IT support requests</p>
          </div>

          <button
            className="view-all-button"
            onClick={() => navigate("/employee/tickets")}
          >
            View All
            <ArrowUpRight size={16} />
          </button>
        </div>

        {loading && (
          <div className="dashboard-message">
            Loading your tickets...
          </div>
        )}

        {!loading && error && (
          <div className="dashboard-message error-message">
            {error}
          </div>
        )}

        {!loading && !error && tickets.length === 0 && (
          <div className="dashboard-message">
            <Ticket size={40} />

            <h3>No tickets yet</h3>

            <p>
              Create your first IT support ticket.
            </p>

            <button
              className="empty-create-btn"
              onClick={() =>
                navigate("/employee/create-ticket")
              }
            >
              <Plus size={17} />
              Create Ticket
            </button>
          </div>
        )}

        {!loading && !error && tickets.length > 0 && (
          <div className="ticket-table">

            <div className="table-header">
              <span>Ticket</span>
              <span>Subject</span>
              <span>Category</span>
              <span>Priority</span>
              <span>Status</span>
            </div>

            {recentTickets.map((ticket) => (
              <div
                className="table-row"
                key={ticket.id}
                onClick={() =>
                  navigate(
                    `/employee/tickets/${ticket.id}`
                  )
                }
              >
                <strong>#{ticket.id}</strong>

                <span className="ticket-title">
                  {ticket.title}
                </span>

                <span>
                  {ticket.category}
                </span>

                <span>
                  <span
                    className={`priority ${ticket.priority.toLowerCase()}`}
                  >
                    {ticket.priority}
                  </span>
                </span>

                <span>
                  <span
                    className={`status ${ticket.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {ticket.status}
                  </span>
                </span>
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default EmployeeDashboard;