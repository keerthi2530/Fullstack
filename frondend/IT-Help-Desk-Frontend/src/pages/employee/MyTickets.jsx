import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Ticket,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../services/api";
import "./MyTickets.css";

function MyTickets() {
  const navigate = useNavigate();
const [tickets, setTickets] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  fetchTickets();
}, []);

const fetchTickets = async () => {
  try {
    const response = await api.get("/tickets/");
    setTickets(response.data);
  } catch (error) {
    console.error(error);
    setError("Unable to load tickets.");
  } finally {
    setLoading(false);
  }
};


  const getStatusClass = (status) => {
    return status.toLowerCase().replace(" ", "-");
  };

  const getPriorityClass = (priority) => {
    return priority.toLowerCase();
  };

  return (
    <div className="my-tickets-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="my-tickets-header">

        <div>
          <div className="my-tickets-title">

            <div className="my-tickets-icon">
              <Ticket size={22} />
            </div>

            <div>
              <h1>My Tickets</h1>
              <p>
                View and track your support requests
              </p>
            </div>

          </div>
        </div>

        <button
          className="new-ticket-button"
          onClick={() =>
            navigate("/employee/create-ticket")
          }
        >
          <Plus size={18} />
          Create Ticket
        </button>

      </div>

      {/* =========================
          FILTER BAR
      ========================= */}

      <div className="ticket-filter-bar">

        <div className="ticket-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search tickets..."
          />

        </div>

        <select>
          <option value="all">
            All Status
          </option>

          <option value="open">
            Open
          </option>

          <option value="in-progress">
            In Progress
          </option>

          <option value="resolved">
            Resolved
          </option>

          <option value="closed">
            Closed
          </option>
        </select>

        <select>
          <option value="all">
            All Priority
          </option>

          <option value="high">
            High
          </option>

          <option value="medium">
            Medium
          </option>

          <option value="low">
            Low
          </option>
        </select>

      </div>

      {/* =========================
          TICKET TABLE
      ========================= */}

      <div className="tickets-card">

        <div className="tickets-card-header">
          <div>
            <h2>Support Requests</h2>
            <p>
              {tickets.length} tickets found
            </p>
          </div>
        </div>

        <div className="tickets-table-wrapper">

          <table className="tickets-table">

            <thead>
              <tr>
                <th>Ticket</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              {tickets.map((ticket) => (

                <tr
                  key={ticket.id}
                  onClick={() =>
                    navigate(
                      `/employee/tickets/${ticket.id}`
                    )
                  }
                >

                  {/* Ticket */}

                  <td>
                    <div className="ticket-title-cell">

                      <span className="ticket-id">
                        #{ticket.id}
                      </span>

                      <strong>
                        {ticket.title}
                      </strong>

                    </div>
                  </td>

                  {/* Category */}

                  <td>
                    <span className="category-text">
                      {ticket.category}
                    </span>
                  </td>

                  {/* Priority */}

                  <td>
                    <span
                      className={`priority-badge ${getPriorityClass(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>

                  {/* Status */}

                  <td>
                    <span
                      className={`ticket-status ${getStatusClass(
                        ticket.status
                      )}`}
                    >
                      <span className="status-small-dot"></span>

                      {ticket.status}
                    </span>
                  </td>

                  {/* Date */}

                  <td>
                    <span className="created-date">
                      {ticket.createdAt}
                    </span>
                  </td>

                  {/* Arrow */}

                  <td>
                    <ChevronRight
                      size={18}
                      className="ticket-arrow"
                    />
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default MyTickets;