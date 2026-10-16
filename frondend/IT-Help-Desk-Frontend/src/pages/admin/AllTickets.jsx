import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Ticket,
  UserRound,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";
import "./AllTickets.css";

function AllTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [supportUsers, setSupportUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [ticketResponse, supportResponse] =
        await Promise.all([
          api.get("/tickets/"),
          api.get("/auth/support-users/"),
        ]);

      setTickets(ticketResponse.data);
      setSupportUsers(supportResponse.data);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load ticket information."
      );
    } finally {
      setLoading(false);
    }
  };

  const assignTicket = async (
    ticketId,
    supportUserId
  ) => {
    try {
      await api.patch(`/tickets/${ticketId}/`, {
        assigned_to: supportUserId || null,
      });

      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                assigned_to:
                  supportUserId
                    ? Number(supportUserId)
                    : null,
                assigned_to_name:
                  supportUsers.find(
                    (user) =>
                      user.id ===
                      Number(supportUserId)
                  )?.username || null,
              }
            : ticket
        )
      );
    } catch (error) {
      console.error(error);

      alert("Unable to assign ticket.");
    }
  };

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(ticket.id).includes(search)
  );

  if (loading) {
    return (
      <div className="all-tickets-loading">
        Loading tickets...
      </div>
    );
  }

  return (
    <div className="all-tickets-page">

      <div className="all-tickets-header">
        <div>
          <h1>All Tickets</h1>

          <p>
            View and assign employee support
            requests.
          </p>
        </div>

        <div className="ticket-count">
          <Ticket size={18} />

          {tickets.length} Tickets
        </div>
      </div>

      {error && (
        <div className="all-tickets-error">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="ticket-toolbar">

        <div className="ticket-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

      </div>

      <div className="all-ticket-card">

        {filteredTickets.length === 0 ? (
          <div className="no-ticket-message">
            <Ticket size={42} />

            <p>No tickets available.</p>
          </div>
        ) : (
          <div className="all-ticket-table-wrapper">

            <table className="all-ticket-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Employee</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                </tr>
              </thead>

              <tbody>

                {filteredTickets.map(
                  (ticket) => (
                    <tr key={ticket.id}>

                      <td
                        className="clickable-ticket"
                        onClick={() =>
                          navigate(
                            `/admin/tickets/${ticket.id}`
                          )
                        }
                      >
                        #{ticket.id}
                      </td>

                      <td>
                        <strong>
                          {ticket.title}
                        </strong>

                        <span className="ticket-category">
                          {ticket.category}
                        </span>
                      </td>

                      <td>
                        <div className="employee-name">
                          <UserRound size={16} />

                          {
                            ticket.created_by_name
                          }
                        </div>
                      </td>

                      <td>
                        <span
                          className={`priority-badge ${ticket.priority.toLowerCase()}`}
                        >
                          {ticket.priority}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${ticket.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {ticket.status}
                        </span>
                      </td>

                      <td>

                        <select
                          className="assign-select"
                          value={
                            ticket.assigned_to ||
                            ""
                          }
                          onChange={(e) =>
                            assignTicket(
                              ticket.id,
                              e.target.value
                            )
                          }
                        >

                          <option value="">
                            Not Assigned
                          </option>

                          {supportUsers.map(
                            (support) => (
                              <option
                                key={support.id}
                                value={support.id}
                              >
                                {
                                  support.username
                                }
                              </option>
                            )
                          )}

                        </select>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default AllTickets;