// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Auth pages
import Login from './pages/user/Login';
import Register from './pages/Register';

// Layouts
import AdminLayout from './components/AdminLayout';
import UserLayout from './layouts/UserLayout';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CreateUser from './pages/admin/CreateUser';
import TournamentsAndLeagues from './pages/admin/TournamentsAndLeagues';
import MatchesAndEvents from './pages/admin/MatchesAndEvents';
import LeagueStandings from './pages/admin/LeagueStandings';
import TeamsAndParticipants from './pages/admin/TeamsAndParticipants';
import PollsAndVotes from './pages/admin/PollsAndVotes';
import AdminInjuries from './pages/admin/Injuries';

// User pages
import Dashboard from './pages/user/Dashboard';
import Profile from './pages/user/Profile';
import UserInjuries from './pages/user/Injuries';
import Polls from './pages/user/Polls';
import Standings from './pages/user/Standings';
import Fixtures from './pages/user/Fixtures';
import MyTeam from './pages/user/MyTeam';

function App() {
  return (
    <Router>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Role-based redirect */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* ================= PROTECTED ROUTES ================= */}
        <Route element={<ProtectedRoute />}>
          
          {/* -------- ADMIN ROUTES -------- */}
          <Route element={<AdminProtected />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/create-user" element={<CreateUser />} />
              <Route path="/admin/tournaments" element={<TournamentsAndLeagues />} />
              <Route path="/admin/matches" element={<MatchesAndEvents />} />
              <Route path="/admin/standings" element={<LeagueStandings />} />
              <Route path="/admin/teams" element={<TeamsAndParticipants />} />
              <Route path="/admin/polls" element={<PollsAndVotes />} />
              <Route path="/admin/votes" element={<PollsAndVotes />} />
              <Route path="/admin/injuries" element={<AdminInjuries />} />
            </Route>
          </Route>

          {/* -------- USER ROUTES -------- */}
          <Route element={<UserLayout />}>
            <Route path="/user/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/injuries" element={<UserInjuries />} />
            <Route path="/polls" element={<Polls />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/matches" element={<Fixtures />} />
            <Route path="/my-team" element={<MyTeam />} />
            {/* add more user routes here */}
          </Route>

        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

/* ================= HELPERS ================= */

// Redirect after login based on role
function DashboardRedirect() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) return <Navigate to="/login" replace />;

  if (user.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/user/dashboard" replace />;
}

// Protect any logged-in route
function ProtectedRoute() {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// Protect admin-only routes
function AdminProtected() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default App;
