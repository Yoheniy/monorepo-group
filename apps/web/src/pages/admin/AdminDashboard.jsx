// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { 
  Users, Clock, Trophy, UsersRound, ArrowUpRight, AlertCircle,
  UserCheck, ShieldAlert, Calendar, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';

// Use forwardRef to allow parent components to call fetchStats
const AdminDashboard = forwardRef((props, ref) => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    approvedUsers: 0,
    rejectedUsers: 0,
    totalTeams: 12, // static, you can update later if needed
    activeTournaments: 3,
    upcomingMatches: 8,
    recentInjuries: 4,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch stats from backend
  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(`${API_BASE_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch users');

      const data = await res.json();
      const users = data.users || [];

      setStats(prev => ({
        ...prev,
        totalUsers: users.length,
        pendingUsers: users.filter(u => u.status === 'PENDING').length,
        approvedUsers: users.filter(u => u.status === 'APPROVED').length,
        rejectedUsers: users.filter(u => u.status === 'REJECTED').length,
      }));
    } catch (err) {
      setError(err.message || 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Expose fetchStats to parent via ref
  useImperativeHandle(ref, () => ({
    refreshStats: fetchStats
  }));

  useEffect(() => {
    fetchStats();
  }, []);

  // Function to handle dashboard refresh/navigation
  const handleDashboardClick = () => {
    if (window.location.pathname === '/admin/dashboard') {
      fetchStats();
    } else {
      navigate('/admin/dashboard');
    }
  };

  // Function to handle card click with hover animation
  const handleCardClick = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <AlertCircle size={48} className="mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error loading dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <button 
            onClick={handleDashboardClick}
            className="text-3xl font-bold text-gray-900 hover:text-indigo-600 transition cursor-pointer"
          >
            Admin Dashboard
          </button>
          <p className="text-gray-600 mt-1">Overview of the league system • Updated just now</p>
        </div>
        <button 
          onClick={() => navigate('/admin/quick-actions')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium"
        >
          <ArrowUpRight size={18} />
          Quick Actions
        </button>
      </div>

      {/* Stats Cards - All Clickable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <button
          onClick={() => handleCardClick('/admin/users')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 transform text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
              <Users className="text-indigo-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">View all users</span>
            <ArrowUpRight size={16} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </button>

        {/* Pending Approvals */}
        <button
          onClick={() => handleCardClick('/admin/pending')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 transform text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">{stats.pendingUsers}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
              <Clock className="text-amber-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-amber-600 font-medium">Needs attention</span>
            <ArrowUpRight size={16} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </button>

        {/* Registered Teams */}
        <button
          onClick={() => handleCardClick('/admin/teams')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 transform text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Registered Teams</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{stats.totalTeams}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <UsersRound className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-blue-600 font-medium">Manage teams</span>
            <ArrowUpRight size={16} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </button>

        {/* Active Tournaments */}
        <button
          onClick={() => handleCardClick('/admin/tournaments')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 transform text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Tournaments</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.activeTournaments}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <Trophy className="text-green-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">View tournaments</span>
            <ArrowUpRight size={16} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </button>

        {/* Upcoming Matches */}
        <button
          onClick={() => handleCardClick('/admin/matches')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 transform text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Upcoming Matches</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{stats.upcomingMatches}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <Calendar className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-purple-600 font-medium">Schedule & manage</span>
            <ArrowUpRight size={16} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </button>

        {/* Recent Injuries */}
        <button
          onClick={() => handleCardClick('/admin/injuries')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 transform text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Recent Injuries</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.recentInjuries}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
              <Activity className="text-red-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-600 font-medium">Monitor health reports</span>
            <ArrowUpRight size={16} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </button>

        {/* Approved Users */}
        <button
          onClick={() => handleCardClick('/admin/users?status=approved')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 transform text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Approved Users</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.approvedUsers}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
              <UserCheck className="text-emerald-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-600 font-medium">Active members</span>
            <ArrowUpRight size={16} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </button>

        {/* Rejected Users */}
        <button
          onClick={() => handleCardClick('/admin/users?status=rejected')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 transform text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Rejected Users</p>
              <p className="text-3xl font-bold text-rose-600 mt-1">{stats.rejectedUsers}</p>
            </div>
            <div className="p-3 bg-rose-100 rounded-lg group-hover:bg-rose-200 transition-colors">
              <ShieldAlert className="text-rose-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-rose-600 font-medium">Review decisions</span>
            <ArrowUpRight size={16} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Recent Pending Users / Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        {/* Recent Pending Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Pending Approvals</h3>
            <button 
              onClick={() => navigate('/admin/pending')}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1 group"
            >
              View all <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <button
                key={i}
                onClick={() => navigate(`/admin/users/${i+1}/review`)}
                className="flex items-center justify-between py-3 border-t border-gray-100 hover:bg-gray-50 px-2 -mx-2 rounded-lg transition-colors w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div>
                    <p className="font-medium">Test User {i+1}</p>
                    <p className="text-sm text-gray-500">Software Engineering • 001/202{i+1}/15</p>
                  </div>
                </div>
                <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                  Pending
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/admin/teams/new')}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-4 px-6 rounded-xl transition-all hover:scale-105 flex flex-col items-center justify-center gap-2"
            >
              <UsersRound size={24} />
              Add New Team
            </button>
            <button 
              onClick={() => navigate('/admin/tournaments/new')}
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-4 px-6 rounded-xl transition-all hover:scale-105 flex flex-col items-center justify-center gap-2"
            >
              <Trophy size={24} />
              Create Tournament
            </button>
            <button 
              onClick={() => navigate('/admin/matches/schedule')}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-4 px-6 rounded-xl transition-all hover:scale-105 flex flex-col items-center justify-center gap-2"
            >
              <ArrowUpRight size={24} />
              Schedule Match
            </button>
            <button 
              onClick={() => navigate('/admin/injuries/report')}
              className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium py-4 px-6 rounded-xl transition-all hover:scale-105 flex flex-col items-center justify-center gap-2"
            >
              <AlertCircle size={24} />
              Report Injury
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AdminDashboard;
