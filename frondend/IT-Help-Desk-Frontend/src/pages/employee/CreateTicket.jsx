import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  ArrowLeft,
  Send,
  Ticket,
} from "lucide-react";

import "./CreateTicket.css";

function CreateTicket() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.title.trim() ||
    !formData.category ||
    !formData.priority ||
    !formData.description.trim()
  ) {
    setError("Please fill in all fields.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    await api.post("/tickets/", {
      title: formData.title,
      category: formData.category,
      priority: formData.priority,
      description: formData.description,
    });

    alert("Ticket created successfully!");

    navigate("/employee/tickets");

  } catch (error) {
    console.error("Ticket creation error:", error);

    setError(
      error.response?.data?.detail ||
      "Unable to create ticket."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="create-ticket-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="create-ticket-header">

        <button
          className="create-back-button"
          onClick={() => navigate("/employee/dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="create-title">
          <div className="create-title-icon">
            <Ticket size={22} />
          </div>

          <div>
            <h1>Create New Ticket</h1>
            <p>
              Submit a new IT support request
            </p>
          </div>
        </div>

      </div>

      {/* =========================
          FORM CARD
      ========================= */}

      <div className="create-ticket-card">

        <div className="form-heading">
          <h2>Ticket Information</h2>

          <p>
            Please provide the details of the issue you are facing.
          </p>
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* TITLE */}

          <div className="form-group">

            <label htmlFor="title">
              Issue Title
              <span>*</span>
            </label>

            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Wi-Fi is not working"
            />

            <small>
              Give a short title describing your problem.
            </small>

          </div>

          {/* CATEGORY + PRIORITY */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="category">
                Category
                <span>*</span>
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">
                  Select category
                </option>

                <option value="Hardware">
                  Hardware
                </option>

                <option value="Software">
                  Software
                </option>

                <option value="Network">
                  Network
                </option>

                <option value="Email">
                  Email
                </option>

                <option value="Access">
                  Access / Login
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

            </div>

            <div className="form-group">

              <label htmlFor="priority">
                Priority
                <span>*</span>
              </label>

              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="">
                  Select priority
                </option>

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

              </select>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="form-group">

            <label htmlFor="description">
              Description
              <span>*</span>
            </label>

            <textarea
              id="description"
              name="description"
              rows="7"
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain your issue in detail..."
            />

            <small>
              Include useful information such as error messages,
              device name, or steps that caused the problem.
            </small>

          </div>

          {/* ACTIONS */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate("/employee/dashboard")
              }
            >
              Cancel
            </button>

           <button type="submit" disabled={loading}>
  <Send size={18} />

  {loading ? "Creating..." : "Create Ticket"}
</button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateTicket;