import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import api from "../services/api";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!email || !password) {
    setError("Please enter your email and password.");
    return;
  }

  try {
    const response = await api.post("/auth/login/", {
      email,
      password,
    });

    const { access, refresh, user } = response.data;

    // Store JWT tokens
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    // Store logged-in user
    localStorage.setItem("user", JSON.stringify(user));

    // Redirect according to backend role
    if (user.role === "employee") {
      navigate("/employee/dashboard");
    } else if (user.role === "support") {
      navigate("/support/dashboard");
    } else if (user.role === "admin") {
      navigate("/admin/dashboard");
    }
  } catch (error) {
    console.error("Login error:", error);

    if (error.response?.status === 400) {
      setError("Invalid email or password.");
    } else {
      setError("Unable to connect to the server.");
    }
  }
};

  return (
    <div className="login-page">

      {/* Left Section */}
      <div className="login-brand-section">

        <div className="brand-content">

          <div className="brand-logo">
            <Wrench size={28} strokeWidth={2.2} />
          </div>

          <h1>IT Help Desk</h1>

          <p className="brand-description">
            A simple and efficient way to report, manage, and resolve
            technical issues.
          </p>

          <div className="feature-list">

            <div className="feature-item">

              <div className="feature-icon">
                <ShieldCheck size={20} />
              </div>

              <div>
                <h3>Secure Support</h3>
                <p>Manage your IT requests securely.</p>
              </div>

            </div>

            <div className="feature-item">

              <div className="feature-icon">
                <Wrench size={20} />
              </div>

              <div>
                <h3>Quick Resolution</h3>
                <p>Track and resolve issues efficiently.</p>
              </div>

            </div>

          </div>
        </div>

        <div className="brand-footer">
          © 2026 IT Help Desk
        </div>

      </div>

      {/* Right Section */}
      <div className="login-form-section">

        <div className="login-card">

          {/* Mobile Logo */}
          <div className="mobile-logo">

            <div className="brand-logo">
              <Wrench size={25} />
            </div>

          </div>

          {/* Header */}
          <div className="login-header">

            <h2>Welcome back</h2>

            <p>
              Sign in to continue to your account
            </p>

          </div>

          {/* Role Selection */}
          <div className="role-section">

            <label>Login as</label>

            <div className="role-options">

              {/* Employee */}
              <button
                type="button"
                className={`role-option ${
                  role === "employee" ? "active" : ""
                }`}
                onClick={() => setRole("employee")}
              >
                <UserRound size={18} />
                <span>Employee</span>
              </button>

              {/* IT Support */}
              <button
                type="button"
                className={`role-option ${
                  role === "support" ? "active" : ""
                }`}
                onClick={() => setRole("support")}
              >
                <Wrench size={18} />
                <span>IT Support</span>
              </button>

              {/* Admin */}
              <button
                type="button"
                className={`role-option ${
                  role === "admin" ? "active" : ""
                }`}
                onClick={() => setRole("admin")}
              >
                <ShieldCheck size={18} />
                <span>Admin</span>
              </button>

            </div>

          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <div className="input-wrapper">

                <Mail
                  size={19}
                  className="input-icon"
                />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

            </div>

            {/* Password */}
            <div className="form-group">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <Link to="/forgot-password">
                  Forgot password?
                </Link>

              </div>

              <div className="input-wrapper">

                <LockKeyhole
                  size={19}
                  className="input-icon"
                />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* Error */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="login-button"
            >
              Sign in
            </button>

          </form>

          <p className="login-note">
            Access is restricted to authorized users.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;