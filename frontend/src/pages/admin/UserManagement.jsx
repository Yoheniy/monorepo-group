// src/pages/admin/UserManagement.jsx
import { useEffect, useState, useMemo } from 'react';
import { 
  Search, CheckCircle, XCircle, Edit, Trash2, UserPlus, Loader2, 
  AlertTriangle, Save, Filter, X, Users, Shield, UserCheck, UserX,
  Mail, Phone, Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Eye, Download, Key, Crown, User, Star, Lock, Unlock, RefreshCw
} from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const res = await fetch('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch users');

      const data = await res.json();
      const usersList = data.users || data || [];
      setUsers(usersList);
    } catch (err) {
      setError(err.message || 'Error loading users');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort users
  useEffect(() => {
    let result = [...users];

    // Tab filter
    if (activeTab === 'pending') {
      result = result.filter(u => u.status === 'PENDING');
    } else if (activeTab === 'approved') {
      result = result.filter(u => u.status === 'APPROVED');
    } else if (activeTab === 'rejected') {
      result = result.filter(u => u.status === 'REJECTED');
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(u =>
        (u.fullName || '').toLowerCase().includes(term) ||
        (u.email || '').toLowerCase().includes(term) ||
        (u.studentId || '').toLowerCase().includes(term) ||
        (u.department || '').toLowerCase().includes(term)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter(u => u.role === roleFilter);
    }

    // Status filter (for all tab)
    if (activeTab === 'all' && statusFilter !== 'all') {
      result = result.filter(u => u.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch(sortField) {
        case 'fullName':
          aValue = a.fullName?.toLowerCase() || '';
          bValue = b.fullName?.toLowerCase() || '';
          break;
        case 'email':
          aValue = a.email?.toLowerCase() || '';
          bValue = b.email?.toLowerCase() || '';
          break;
        case 'role':
          aValue = a.role || '';
          bValue = b.role || '';
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        default:
          aValue = a.fullName?.toLowerCase() || '';
          bValue = b.fullName?.toLowerCase() || '';
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, searchTerm, roleFilter, statusFilter, activeTab, sortField, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredUsers.length);
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Render pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
    
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }
    
    // First page
    buttons.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronsLeft size={16} />
      </button>
    );
    
    // Previous page
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft size={16} />
      </button>
    );
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 min-w-[2.5rem] rounded-md transition ${
            currentPage === i
              ? 'bg-indigo-600 text-white border border-indigo-600'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Next page
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronRight size={16} />
      </button>
    );
    
    // Last page
    buttons.push(
      <button
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronsRight size={16} />
      </button>
    );
    
    return buttons;
  };

  // User actions
  const handleApprove = async (id) => {
    if (!confirm('Approve this user?')) return;
    setActionLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/auth/users/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to approve');

      await fetchUsers();
      setSuccess('User approved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error approving user: ' + err.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Reject this user?')) return;
    setActionLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/auth/users/${id}/reject`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to reject');

      await fetchUsers();
      setSuccess('User rejected successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error rejecting user: ' + err.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setShowResetPasswordModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setActionLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/auth/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: editingUser.role,
          department: editingUser.department,
          status: editingUser.status,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update user');
      }

      await fetchUsers();
      setShowEditModal(false);
      setEditingUser(null);
      setSuccess('User updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error updating user: ' + err.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user permanently? This cannot be undone.')) return;
    setActionLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete user');

      await fetchUsers();
      setSuccess('User deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error deleting user: ' + err.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  // Statistics
  const stats = useMemo(() => {
    const total = users.length;
    const pending = users.filter(u => u.status === 'PENDING').length;
    const approved = users.filter(u => u.status === 'APPROVED').length;
    const rejected = users.filter(u => u.status === 'REJECTED').length;
    const admins = users.filter(u => u.role === 'ADMIN').length;
    const coaches = users.filter(u => u.role === 'COACH').length;
    const players = users.filter(u => u.role === 'PLAYER').length;
    
    return { total, pending, approved, rejected, admins, coaches, players };
  }, [users]);

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="p-6 md:p-10 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Success Message */}
      {success && (
        <div className="fixed top-6 right-6 z-50 animate-slideIn">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <CheckCircle size={24} />
            <span className="font-semibold">{success}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-6 right-6 z-50 animate-slideIn">
          <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <AlertTriangle size={24} />
            <span className="font-semibold">{error}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <Shield className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage user accounts, approvals, and permissions</p>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          Refresh Users
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="flex gap-4 mt-4 text-sm">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Admin: {stats.admins}</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Coach: {stats.coaches}</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Player: {stats.players}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-amber-50 border-2 border-amber-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending Approval</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-100 to-amber-200 flex items-center justify-center">
              <UserCheck className="text-amber-600" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-amber-100 rounded-full h-2">
              <div 
                className="bg-amber-600 h-2 rounded-full" 
                style={{ width: `${(stats.pending / Math.max(stats.total, 1)) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-amber-600 mt-2 text-right">
              {stats.pending} pending of {stats.total} total
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-emerald-50 border-2 border-emerald-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Approved Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.approved}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-100 to-emerald-200 flex items-center justify-center">
              <CheckCircle className="text-emerald-600" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-emerald-100 rounded-full h-2">
              <div 
                className="bg-emerald-600 h-2 rounded-full" 
                style={{ width: `${(stats.approved / Math.max(stats.total, 1)) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-emerald-600 mt-2 text-right">
              {Math.round((stats.approved / Math.max(stats.total, 1)) * 100)}% approval rate
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-rose-50 border-2 border-rose-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Rejected Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.rejected}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-rose-100 to-rose-200 flex items-center justify-center">
              <UserX className="text-rose-600" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-rose-100 rounded-full h-2">
              <div 
                className="bg-rose-600 h-2 rounded-full" 
                style={{ width: `${(stats.rejected / Math.max(stats.total, 1)) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-rose-600 mt-2 text-right">
              {stats.rejected} rejected of {stats.total} total
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'all' 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={18} />
              All Users ({stats.total})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'pending' 
                ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <UserCheck size={18} />
              Pending ({stats.pending})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'approved' 
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={18} />
              Approved ({stats.approved})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'rejected' 
                ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <UserX size={18} />
              Rejected ({stats.rejected})
            </div>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, ID or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
              />
            </div>
          </div>
          
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300 appearance-none bg-white"
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">Administrator</option>
              <option value="COACH">Coach</option>
              <option value="PLAYER">Player</option>
            </select>
          </div>
          
          {activeTab === 'all' && (
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{startIndex + 1}-{endIndex}</span> of{' '}
            <span className="font-semibold">{filteredUsers.length}</span> users
            {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={clearFilters}
                className="ml-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
              >
                <X size={16} />
                Clear filters
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition-all duration-300"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-96 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center p-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <Users className="text-gray-400" size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Users Found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'No users registered yet'}
          </p>
          <button
            onClick={clearFilters}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th 
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors rounded-l-xl"
                      onClick={() => handleSort('fullName')}
                    >
                      <div className="flex items-center gap-2">
                        User Details
                        {sortField === 'fullName' && (
                          <span className="text-indigo-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleSort('role')}
                    >
                      <div className="flex items-center gap-2">
                        Role
                        {sortField === 'role' && (
                          <span className="text-indigo-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortField === 'status' && (
                          <span className="text-indigo-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ID Verification
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-r-xl">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gradient-to-r from-gray-50 to-gray-100 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                            <User size={18} className="text-indigo-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{user.fullName}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                              <span>ID: {user.studentId}</span>
                              {user.phone && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span>{user.phone}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 w-24 ${
                          user.role === 'ADMIN' 
                            ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200 shadow-sm' 
                            : user.role === 'COACH'
                            ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200 shadow-sm'
                            : 'bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm'
                        }`}>
                          {user.role === 'ADMIN' && <Crown size={12} />}
                          {user.role === 'COACH' && <Star size={12} />}
                          {user.role === 'PLAYER' && <User size={12} />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 w-24 ${
                          user.status === 'APPROVED' 
                            ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-200' 
                            : user.status === 'PENDING'
                            ? 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-200'
                            : 'bg-gradient-to-r from-rose-100 to-rose-200 text-rose-800 border border-rose-200'
                        }`}>
                          {user.status === 'APPROVED' && <CheckCircle size={12} />}
                          {user.status === 'PENDING' && <Loader2 size={12} className="animate-spin" />}
                          {user.status === 'REJECTED' && <XCircle size={12} />}
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{user.department || '—'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {user.idFront ? (
                            <a 
                              href={user.idFront} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-300 text-xs font-medium flex items-center gap-1.5"
                            >
                              <Eye size={12} />
                              Front
                            </a>
                          ) : (
                            <span className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs">No Front</span>
                          )}
                          
                          {user.idBack ? (
                            <a 
                              href={user.idBack} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-300 text-xs font-medium flex items-center gap-1.5"
                            >
                              <Eye size={12} />
                              Back
                            </a>
                          ) : (
                            <span className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs">No Back</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleView(user)}
                            className="p-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 hover:text-gray-800 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-110"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          
                          {user.status === 'PENDING' && (
                            <>
                              <button 
                                onClick={() => handleApprove(user.id)}
                                disabled={actionLoading}
                                className="p-2 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-600 hover:text-emerald-800 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-110"
                                title="Approve User"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button 
                                onClick={() => handleReject(user.id)}
                                disabled={actionLoading}
                                className="p-2 bg-gradient-to-r from-rose-50 to-rose-100 text-rose-600 hover:text-rose-800 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-110"
                                title="Reject User"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                          
                          <button 
                            onClick={() => handleEdit(user)}
                            disabled={actionLoading}
                            className="p-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 hover:text-blue-800 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-110"
                            title="Edit User"
                          >
                            <Edit size={18} />
                          </button>
                          
                          <button 
                            onClick={() => handleResetPassword(user)}
                            className="p-2 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-600 hover:text-amber-800 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-110"
                            title="Reset Password"
                          >
                            <Key size={18} />
                          </button>
                          
                          <button 
                            onClick={() => handleDelete(user.id)}
                            disabled={actionLoading}
                            className="p-2 bg-gradient-to-r from-rose-50 to-rose-100 text-rose-600 hover:text-rose-800 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-110"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="text-sm text-gray-600">
                Page <span className="font-semibold">{currentPage}</span> of{' '}
                <span className="font-semibold">{totalPages}</span> •{' '}
                <span className="font-semibold">{filteredUsers.length}</span> total users
              </div>
              
              <div className="flex items-center gap-2">
                {renderPaginationButtons()}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Go to:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= totalPages) {
                      handlePageChange(page);
                    }
                  }}
                  className="w-20 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition-all duration-300"
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="sticky top-0 bg-white z-10 rounded-t-3xl border-b border-gray-200 p-8 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">User Details</h2>
                <p className="text-gray-600 mt-1">Complete user information</p>
              </div>
              <button 
                onClick={() => setShowViewModal(false)}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X size={28} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* User Info */}
              <div className="text-center mb-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                  <User size={40} className="text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedUser.fullName}</h3>
                <p className="text-gray-600">{selectedUser.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Student ID</p>
                  <p className="font-semibold text-gray-900">{selectedUser.studentId}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="font-semibold text-gray-900">{selectedUser.phone || '—'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Role</p>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    selectedUser.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                    selectedUser.role === 'COACH' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedUser.role}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    selectedUser.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    selectedUser.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Department</p>
                <p className="font-semibold text-gray-900">{selectedUser.department || 'Not specified'}</p>
              </div>

              {/* ID Photos */}
              {(selectedUser.idFront || selectedUser.idBack) && (
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-4">ID Verification</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedUser.idFront && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Front ID</p>
                        <a 
                          href={selectedUser.idFront} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                          View Front ID
                        </a>
                      </div>
                    )}
                    {selectedUser.idBack && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Back ID</p>
                        <a 
                          href={selectedUser.idBack} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                          View Back ID
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-8 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(selectedUser);
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  Edit User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="sticky top-0 bg-white z-10 rounded-t-3xl border-b border-gray-200 p-8 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Edit User</h2>
                <p className="text-gray-600 mt-1">Update user details and permissions</p>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors duration-200"
                disabled={actionLoading}
              >
                <X size={28} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-8 space-y-8">
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-2xl border border-indigo-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                    <User size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{editingUser.fullName}</h4>
                    <p className="text-sm text-gray-600">{editingUser.email}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Student ID: <span className="font-semibold">{editingUser.studentId}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Role *</label>
                  <select
                    value={editingUser.role || 'PLAYER'}
                    onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                    disabled={actionLoading}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300 appearance-none bg-white"
                  >
                    <option value="ADMIN">Administrator</option>
                    <option value="COACH">Coach</option>
                    <option value="PLAYER">Player</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Status *</label>
                  <select
                    value={editingUser.status || 'PENDING'}
                    onChange={e => setEditingUser({ ...editingUser, status: e.target.value })}
                    disabled={actionLoading}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300 appearance-none bg-white"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Department</label>
                <input
                  type="text"
                  value={editingUser.department || ''}
                  onChange={e => setEditingUser({ ...editingUser, department: e.target.value })}
                  disabled={actionLoading}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
                  placeholder="Computer Science, Engineering, etc."
                />
              </div>

              <div className="flex justify-end gap-6 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={actionLoading}
                  className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-slideUp">
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
                <Key className="text-amber-600" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Reset Password</h2>
              <p className="text-gray-600 mb-2">
                Reset password for <span className="font-bold text-indigo-700">{selectedUser.fullName}</span>?
              </p>
              <p className="text-sm text-gray-600 mb-1">
                {selectedUser.email}
              </p>
              <p className="text-sm text-amber-600 mb-6">
                A new temporary password will be generated and sent to the user's email.
              </p>
              
              <div className="flex justify-center gap-4 pt-6">
                <button
                  onClick={() => setShowResetPasswordModal(false)}
                  disabled={actionLoading}
                  className="px-8 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Password reset functionality would be implemented here');
                    setShowResetPasswordModal(false);
                  }}
                  disabled={actionLoading}
                  className="px-8 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-xl hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 font-semibold shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <Key size={18} />
                      Reset Password
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}