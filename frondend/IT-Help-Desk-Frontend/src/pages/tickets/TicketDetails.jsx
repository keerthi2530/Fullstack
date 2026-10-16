import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Send,
  UserRound,
  CalendarDays,
  Tag,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";
import "./TicketDetails.css";

function TicketDetails() {
  const { ticketId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);

  // --------------------------------
  // Get current role
  // --------------------------------

  const getRole = () => {
    if (location.pathname.startsWith("/support")) {
      return "support";
    }

    if (location.pathname.startsWith("/admin")) {
      return "admin";
    }

    return "employee";
  };

  const role = getRole();

  // --------------------------------
  // Fetch ticket
  // --------------------------------

useEffect(() => {
  fetchComments();
}, [ticketId]);

const fetchComments = async () => {
  try {
    const response = await api.get(
      `/comments/?ticket=${ticketId}`
    );

    setComments(response.data);
  } catch (error) {
    console.error(
      "Comment loading error:",
      error
    );
  }
};

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/tickets/${ticketId}/`);

      setTicket(response.data);
    } catch (error) {
      console.error("Ticket loading error:", error);

      setError(
        error.response?.data?.detail ||
          "Unable to load ticket."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // Back button
  // --------------------------------

  const handleBack = () => {
    if (role === "employee") {
      navigate("/employee/tickets");
    } else if (role === "support") {
      navigate("/support/tickets");
    } else {
      navigate("/admin/tickets");
    }
  };

  // --------------------------------
  // Change status
  // --------------------------------

  const handleStatusChange = async (newStatus) => {
    try {
      setSaving(true);

      const response = await api.patch(
        `/tickets/${ticketId}/`,
        {
          status: newStatus,
        }
      );

      setTicket(response.data);
    } catch (error) {
      console.error("Status update error:", error);

      alert(
        error.response?.data?.detail ||
          "Unable to update ticket status."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------
  // Add comment
  // --------------------------------

const handleComment = async (e) => {
  e.preventDefault();

  if (!comment.trim()) {
    return;
  }

  try {
    setCommentLoading(true);

    const response = await api.post(
      "/comments/",
      {
        ticket: ticketId,
        message: comment.trim(),
      }
    );

    setComments((currentComments) => [
      ...currentComments,
      response.data,
    ]);

    setComment("");
  } catch (error) {
    console.error(
      "Comment error:",
      error
    );

    alert(
      error.response?.data?.detail ||
        "Unable to add comment."
    );
  } finally {
    setCommentLoading(false);
  }
};

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <div className="ticket-details-loading">
        Loading ticket...
      </div>
    );
  }

  // --------------------------------
  // Error
  // --------------------------------

  if (error) {
    return (
      <div className="ticket-details-error">
        <AlertCircle size={22} />
        <p>{error}</p>

        <button onClick={handleBack}>
          <ArrowLeft size={18} />
          Back
        </button>
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  // --------------------------------
  // Main UI
  // --------------------------------

  return (
    <div className="ticket-details-page">

      {/* Header */}

      <div className="ticket-details-header">

        <button
          className="back-button"
          onClick={handleBack}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div>
          <div className="ticket-number">
            Ticket #{ticket.id}
          </div>

          <h1>{ticket.title}</h1>

          <p>
            Created by{" "}
            <strong>
              {ticket.created_by_name}
            </strong>
          </p>
        </div>

      </div>

      {/* Main Grid */}

      <div className="ticket-details-grid">

        {/* Left Section */}

        <div className="ticket-main-card">

          <div className="ticket-card-header">
            <h2>Ticket Description</h2>

            <span
              className={`status-badge ${ticket.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {ticket.status}
            </span>
          </div>

          <div className="ticket-description">
            {ticket.description}
          </div>

          {/* Ticket information */}

          <div className="ticket-info-grid">

            <div className="ticket-info-item">
              <Tag size={18} />

              <div>
                <span>Category</span>
                <strong>{ticket.category}</strong>
              </div>
            </div>

            <div className="ticket-info-item">
              <AlertCircle size={18} />

              <div>
                <span>Priority</span>

                <strong
                  className={`priority-text ${ticket.priority.toLowerCase()}`}
                >
                  {ticket.priority}
                </strong>
              </div>
            </div>

            <div className="ticket-info-item">
              <UserRound size={18} />

              <div>
                <span>Created By</span>
                <strong>
                  {ticket.created_by_name}
                </strong>
              </div>
            </div>

            <div className="ticket-info-item">
              <UserRound size={18} />

              <div>
                <span>Assigned To</span>

                <strong>
                  {ticket.assigned_to_name ||
                    "Not Assigned"}
                </strong>
              </div>
            </div>

            <div className="ticket-info-item">
              <CalendarDays size={18} />

              <div>
                <span>Created</span>

                <strong>
                  {new Date(
                    ticket.created_at
                  ).toLocaleString()}
                </strong>
              </div>
            </div>

            <div className="ticket-info-item">
              <Clock3 size={18} />

              <div>
                <span>Last Updated</span>

                <strong>
                  {new Date(
                    ticket.updated_at
                  ).toLocaleString()}
                </strong>
              </div>
            </div>

          </div>

{/* Support Status Actions */}

{role === "support" && (
  <div className="ticket-status-section">
    <div className="status-section-header">
      <div>
        <h3>Ticket Progress</h3>
        <p>Update the ticket as you work on the issue.</p>
      </div>

      <span className="current-status">
        {ticket.status}
      </span>
    </div>

    <div className="support-status-actions">

      {ticket.status === "Open" && (
        <button
          className="status-action-button start-button"
          disabled={saving}
          onClick={() =>
            handleStatusChange("In Progress")
          }
        >
          <Clock3 size={17} />
          {saving ? "Updating..." : "Start Working"}
        </button>
      )}

      {ticket.status === "In Progress" && (
        <button
          className="status-action-button resolve-button"
          disabled={saving}
          onClick={() =>
            handleStatusChange("Resolved")
          }
        >
          <CheckCircle2 size={17} />
          {saving ? "Updating..." : "Mark as Resolved"}
        </button>
      )}

      {ticket.status === "Resolved" && (
        <div className="resolved-message">
          <CheckCircle2 size={18} />

          <div>
            <strong>Ticket Resolved</strong>
            <p>
              The employee can now confirm the issue
              and close the ticket.
            </p>
          </div>
        </div>
      )}

      {ticket.status === "Closed" && (
        <div className="closed-message">
          <CheckCircle2 size={18} />

          <div>
            <strong>Ticket Closed</strong>
            <p>
              This ticket has been completed.
            </p>
          </div>
        </div>
      )}

    </div>
  </div>
)}

{/* Admin Status Actions */}

{role === "admin" && (
  <div className="ticket-status-section">
    <div className="status-section-header">
      <div>
        <h3>Ticket Status</h3>
        <p>Administrators can update the ticket status.</p>
      </div>

      <span className="current-status">
        {ticket.status}
      </span>
    </div>

    <div className="status-buttons">

      {["Open", "In Progress", "Resolved"].map(
        (status) => (
          <button
            key={status}
            className={
              ticket.status === status
                ? "active"
                : ""
            }
            disabled={saving}
            onClick={() =>
              handleStatusChange(status)
            }
          >
            {status === "Resolved" && (
              <CheckCircle2 size={16} />
            )}

            {status}
          </button>
        )
      )}

    </div>
  </div>
)}
          {/* Employee close button */}

          {role === "employee" &&
            ticket.status === "Resolved" && (
              <div className="employee-close-section">

                <h3>
                  Has your issue been resolved?
                </h3>

                <p>
                  If the problem is fixed, you can
                  close this ticket.
                </p>

                <button
                  className="close-ticket-button"
                  disabled={saving}
                  onClick={() =>
                    handleStatusChange("Closed")
                  }
                >
                  <CheckCircle2 size={18} />
                  Close Ticket
                </button>

              </div>
            )}

        </div>

        {/* Right Section */}

        <div className="ticket-side-card">

          <h2>Ticket Activity</h2>

          <div className="activity-item">

            <div className="activity-icon">
              <TicketIcon />
            </div>

            <div>
              <strong>
                Ticket Created
              </strong>

              <p>
                {ticket.created_by_name} created
                this ticket.
              </p>

              <span>
                {new Date(
                  ticket.created_at
                ).toLocaleString()}
              </span>
            </div>

          </div>

          {ticket.assigned_to_name && (
            <div className="activity-item">

              <div className="activity-icon">
                <UserRound size={17} />
              </div>

              <div>
                <strong>
                  Ticket Assigned
                </strong>

                <p>
                  Assigned to{" "}
                  {ticket.assigned_to_name}.
                </p>
              </div>

            </div>
          )}

          <div className="activity-item">

            <div className="activity-icon">
              <Clock3 size={17} />
            </div>

            <div>
              <strong>
                Current Status
              </strong>

              <p>
                Ticket is currently{" "}
                <strong>
                  {ticket.status}
                </strong>
                .
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Comments */}

      <div className="ticket-comments-card">

        <div className="comments-header">
          <h2>Comments</h2>

          <span>
            Communication
          </span>
        </div>

       <div className="comments-list">

  {comments.length === 0 ? (
    <div className="no-comments">
      <p>No comments yet.</p>
    </div>
  ) : (
    comments.map((item) => (
      <div
        className="comment-item"
        key={item.id}
      >
        <div className="comment-avatar">
          <UserRound size={18} />
        </div>

        <div className="comment-content">

          <div className="comment-top">
            <strong>
              {item.username}
            </strong>

            <span>
              {new Date(
                item.created_at
              ).toLocaleString()}
            </span>
          </div>

          <p>
            {item.message}
          </p>

        </div>
      </div>
    ))
  )}

</div>

        <form
          className="comment-form"
          onSubmit={handleComment}
        >
          <textarea
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            rows="4"
          />

         <button
  type="submit"
  disabled={commentLoading}
>
  <Send size={18} />

  {commentLoading
    ? "Sending..."
    : "Send Comment"}
</button>
        </form>

      </div>

    </div>
  );
}


// Small icon component

function TicketIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 5h6" />
      <path d="M15 9h6" />
      <path d="M15 13h6" />
      <path d="M3 5h8v14H3z" />
    </svg>
  );
}

export default TicketDetails;