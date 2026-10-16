import { useEffect, useState } from "react";
import {
  Search,
  Wrench,
  Ticket,
  UserCheck,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";
import "./ITTeam.css";

function ITTeam() {
  const [team, setTeam] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSupportTeam();
  }, []);

  const fetchSupportTeam = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/auth/support-team/"
      );

      setTeam(response.data);
    } catch (error) {
      console.error(
        "Support team loading error:",
        error
      );

      setError(
        error.response?.data?.detail ||
          "Unable to load IT support team."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredTeam = team.filter((member) => {
    const searchText = search.toLowerCase();

    return (
      member.username
        .toLowerCase()
        .includes(searchText) ||
      member.email
        .toLowerCase()
        .includes(searchText)
    );
  });

  return (
    <div className="it-team-page">

      {/* Header */}
      <div className="it-team-heading">

        <div>
          <h1>IT Support Team</h1>

          <p>
            View and manage your IT support team members.
          </p>
        </div>

        <div className="team-count">
          <UserCheck size={18} />
          {team.length} Members
        </div>

      </div>

      {/* Search */}
      <div className="team-toolbar">

        <div className="team-search">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search support members..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      {/* Loading */}
      {loading && (
        <div className="team-message">
          Loading IT support team...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="team-message error">

          <AlertCircle size={22} />

          <span>{error}</span>

        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        filteredTeam.length === 0 && (
          <div className="team-message">

            <Wrench size={40} />

            <h3>No support members found</h3>

            <p>
              No IT support members match your search.
            </p>

          </div>
        )}

      {/* Team */}
      {!loading &&
        !error &&
        filteredTeam.length > 0 && (

          <div className="team-grid">

            {filteredTeam.map((member) => (

              <div
                className="team-card"
                key={member.id}
              >

                {/* Top */}
                <div className="team-card-top">

                  <div className="team-avatar">
                    {member.username
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <span className="online-status">
                    {member.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>

                {/* User */}
                <div className="team-user">

                  <h3>
                    {member.username}
                  </h3>

                  <p>
                    {member.email}
                  </p>

                </div>

                {/* Role */}
                <div className="team-role">

                  <Wrench size={16} />

                  <span>
                    IT Support
                  </span>

                </div>

                {/* Tickets */}
                <div className="assigned-count">

                  <div className="assigned-icon">
                    <Ticket size={17} />
                  </div>

                  <div>
                    <strong>
                      {member.assigned_tickets}
                    </strong>

                    <span>
                      Assigned Tickets
                    </span>
                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

    </div>
  );
}

export default ITTeam;