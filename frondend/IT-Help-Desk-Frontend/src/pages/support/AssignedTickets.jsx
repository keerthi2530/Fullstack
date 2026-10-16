import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";
import "./AssignedTickets.css";

function AssignedTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get(
        "/tickets/"
      );

      setTickets(response.data);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load assigned tickets."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading assigned tickets...</p>;
  }

  return (
    <div className="assigned-page">

      <div className="assigned-header">
        <div>
          <h1>Assigned Tickets</h1>

          <p>
            Tickets assigned to you by the
            administrator.
          </p>
        </div>
      </div>

      {error && (
        <div className="assigned-error">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="assigned-empty">
          <Ticket size={45} />

          <h3>No assigned tickets</h3>

          <p>
            Tickets assigned by the admin
            will appear here.
          </p>
        </div>
      ) : (
        <div className="assigned-grid">

          {tickets.map((ticket) => (
            <div
              className="assigned-card"
              key={ticket.id}
              onClick={() =>
                navigate(
                  `/support/tickets/${ticket.id}`
                )
              }
            >

              <div className="assigned-card-top">
                <span className="assigned-id">
                  #{ticket.id}
                </span>

                <span
                  className={`priority-badge ${ticket.priority.toLowerCase()}`}
                >
                  {ticket.priority}
                </span>
              </div>

              <h3>{ticket.title}</h3>

              <p>{ticket.description}</p>

              <div className="assigned-meta">

                <span>
                  {ticket.category}
                </span>

                <span
                  className={`status-badge ${ticket.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {ticket.status}
                </span>

              </div>

              <div className="assigned-by">
                Created by:{" "}
                <strong>
                  {ticket.created_by_name}
                </strong>
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default AssignedTickets;