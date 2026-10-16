import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  ShieldCheck,
  LogOut,
  ArrowLeft,
} from "lucide-react";

import "./EmployeeProfile.css";

function EmployeeProfile() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  if (!user) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className="employee-profile">

      {/* Header */}
      <div className="profile-heading">
        <div>
          <h1>My Profile</h1>
          <p>View your account information.</p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/employee/dashboard")}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>
      </div>

      {/* Profile Card */}
      <div className="profile-card">

        <div className="profile-cover"></div>

        <div className="profile-content">

          {/* Avatar */}
          <div className="profile-avatar">
            <UserRound size={42} />
          </div>

          <div className="profile-main">
            <h2>{user.username}</h2>
            <span className="role-badge">
              Employee
            </span>
          </div>

          {/* Information */}
          <div className="profile-info">

            <div className="info-item">
              <div className="info-icon">
                <UserRound size={20} />
              </div>

              <div>
                <span>Username</span>
                <strong>{user.username}</strong>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <Mail size={20} />
              </div>

              <div>
                <span>Email Address</span>
                <strong>{user.email}</strong>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <ShieldCheck size={20} />
              </div>

              <div>
                <span>Role</span>
                <strong>Employee</strong>
              </div>
            </div>

          </div>

          {/* Logout */}
          <div className="profile-actions">
            <button
              className="logout-button"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

export default EmployeeProfile;