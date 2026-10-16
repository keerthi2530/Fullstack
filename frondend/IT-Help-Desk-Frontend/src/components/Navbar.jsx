import {
  Bell,
  Search,
  UserCircle,
} from "lucide-react";

import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">

      {/* Search */}

      <div className="navbar-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search tickets..."
        />
      </div>

      {/* Right Side */}

      <div className="navbar-right">

        <button className="notification-button">
          <Bell size={20} />

          <span className="notification-dot"></span>
        </button>

        <div className="navbar-user">

          <UserCircle size={34} />

          <div>
            <strong>John Doe</strong>
            <span>Employee</span>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;