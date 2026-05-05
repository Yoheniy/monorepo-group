import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth pages
import Login from './pages/user/Login';
import Register from './pages/Register';

// Shared package layouts and guards
import AdminLayout from '@cph/ui-components/astu/AdminLayout';
import UserLayout from '@cph/ui-components/astu/UserLayout';
import { AdminProtected, DashboardRedirect, ProtectedRoute } from '@cph/feature-y/auth-guards';

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
          </Route>
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
