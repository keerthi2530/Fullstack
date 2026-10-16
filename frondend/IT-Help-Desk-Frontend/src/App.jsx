import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";

// Employee
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import CreateTicket from "./pages/employee/CreateTicket";
import MyTickets from "./pages/employee/MyTickets";
import EmployeeProfile from "./pages/employee/EmployeeProfile";

// Support
import SupportDashboard from "./pages/support/SupportDashboard";
import AssignedTickets from "./pages/support/AssignedTickets";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AllTickets from "./pages/admin/AllTickets";

// Shared
import TicketDetails from "./pages/tickets/TicketDetails";
import Users from "./pages/admin/Users";

import ITTeam from "./pages/admin/ITTeam";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            LOGIN
        ========================== */}

        <Route path="/" element={<Login />} />


        {/* =========================
            EMPLOYEE
        ========================== */}

        <Route
          path="/employee"
          element={<DashboardLayout />}
        >
          <Route
            index
            element={
              <Navigate
                to="/employee/dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<EmployeeDashboard />}
          />

          <Route
            path="create-ticket"
            element={<CreateTicket />}
          />

          <Route
            path="tickets"
            element={<MyTickets />}
          />

          <Route
            path="tickets/:ticketId"
            element={<TicketDetails />}
          />

          <Route
  path="profile"
  element={<EmployeeProfile />}
/>
        </Route>


        {/* =========================
            IT SUPPORT
        ========================== */}

        <Route
          path="/support"
          element={<DashboardLayout />}
        >
          <Route
            index
            element={
              <Navigate
                to="/support/dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<SupportDashboard />}
          />

          <Route
            path="tickets"
            element={<AssignedTickets />}
          />

          <Route
            path="tickets/:ticketId"
            element={<TicketDetails />}
          />
        </Route>


        {/* =========================
            ADMIN
        ========================== */}

        <Route
          path="/admin"
          element={<DashboardLayout />}
        >
          <Route
            index
            element={
              <Navigate
                to="/admin/dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
    path="users"
    element={<Users />}
  />

          <Route
            path="tickets"
            element={<AllTickets />}
          />

          <Route
            path="tickets/:ticketId"
            element={<TicketDetails />}
          />


          <Route
  path="support-team"
  element={<ITTeam />}
/>
        </Route>


        {/* =========================
            FORGOT PASSWORD
        ========================== */}

        <Route
          path="/forgot-password"
          element={
            <div className="placeholder-page">
              <h2>Forgot Password</h2>
              <p>
                Password recovery will be implemented later.
              </p>
            </div>
          }
        />


        {/* =========================
            UNKNOWN URL
        ========================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;