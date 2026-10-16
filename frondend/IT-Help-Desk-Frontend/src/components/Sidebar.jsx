import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Ticket,
  UserRound,
  Users,
  UserCog,
  ListTodo,
  LogOut,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get role from current URL
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

  // Menu based on role
  const menuItems = {
    employee: [
      {
        name: "Dashboard",
        path: "/employee/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Create Ticket",
        path: "/employee/create-ticket",
        icon: PlusCircle,
      },
      {
        name: "My Tickets",
        path: "/employee/tickets",
        icon: Ticket,
      },
      {
        name: "Profile",
        path: "/employee/profile",
        icon: UserRound,
      },
    ],

    support: [
      {
        name: "Dashboard",
        path: "/support/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Assigned Tickets",
        path: "/support/tickets",
        icon: ListTodo,
      },
      {
        name: "All Tickets",
        path: "/support/all-tickets",
        icon: Ticket,
      },
      {
        name: "Profile",
        path: "/support/profile",
        icon: UserRound,
      },
    ],

    admin: [
      {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "All Tickets",
        path: "/admin/tickets",
        icon: Ticket,
      },
      {
        name: "Users",
        path: "/admin/users",
        icon: Users,
      },
      {
        name: "IT Support Team",
        path: "/admin/support-team",
        icon: UserCog,
      },
      {
        name: "Profile",
        path: "/admin/profile",
        icon: UserRound,
      },
    ],
  };

  const currentMenu = menuItems[role];

  const roleInfo = {
    employee: {
      title: "Employee",
      icon: UserRound,
    },
    support: {
      title: "IT Support",
      icon: Headphones,
    },
    admin: {
      title: "Administrator",
      icon: ShieldCheck,
    },
  };

  const RoleIcon = roleInfo[role].icon;

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Headphones size={22} />
        </div>

        <div>
          <h2>IT Help Desk</h2>
          <span>Support Portal</span>
        </div>
      </div>

      {/* Role */}
      <div className="sidebar-role">
        <RoleIcon size={17} />

        <div>
          <span>Logged in as</span>
          <strong>{roleInfo[role].title}</strong>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <p className="nav-title">MAIN MENU</p>

        {currentMenu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;