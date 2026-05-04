// src/pages/admin/TeamsAndParticipants.jsx
import { useEffect, useState, useMemo } from 'react';
import { 
  UsersRound, Plus, Edit, Trash2, UserPlus, UserMinus, AlertTriangle, 
  Shield, Save, X, Search, Filter, Shirt, Users, Trophy, Goal,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, User, Crown,
  CheckCircle, Info, Upload, Loader2
} from 'lucide-react';

export default function TeamsAndParticipants() {
  const [activeTab, setActiveTab] = useState('teams');
  const [teams, setTeams] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState('');
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [availableCoaches, setAvailableCoaches] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
  const [showEditParticipantModal, setShowEditParticipantModal] = useState(false);
  const [showDeleteParticipantModal, setShowDeleteParticipantModal] = useState(false);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [showTeamMembersModal, setShowTeamMembersModal] = useState(false);
  const [teamMembersModalTeam, setTeamMembersModalTeam] = useState(null);
  
  // Selected items
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  
  // Form states
  const [teamForm, setTeamForm] = useState({
    name: '',
    shortName: '',
    department: '',
    color: '#7C3AED',
    logo: '',
    tournamentId: '',
    coachId: '',
  });

  const [participantForm, setParticipantForm] = useState({
    userId: '',
    teamId: '',
    jerseyNumber: '',
    position: '',
    role: 'player' // 'player' or 'coach'
  });

  const [newParticipantForm, setNewParticipantForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'player',
    userId: '',
    teamId: '',
    jerseyNumber: '',
    position: ''
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter and sort participants
  const filteredParticipants = useMemo(() => {
    return participants.filter(participant => {
      const matchesSearch = searchTerm === '' || 
        participant.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.team?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || 
        (roleFilter === 'coach' && participant.coachedTeamId) ||
        (roleFilter === 'player' && !participant.coachedTeamId);
      
      return matchesSearch && matchesRole;
    });
  }, [participants, searchTerm, roleFilter]);

  // Sort participants
  const sortedParticipants = useMemo(() => {
    return [...filteredParticipants].sort((a, b) => {
      let aValue, bValue;
      
      switch(sortField) {
        case 'name':
          aValue = a.user?.fullName?.toLowerCase() || '';
          bValue = b.user?.fullName?.toLowerCase() || '';
          break;
        case 'role':
          aValue = a.coachedTeamId ? 'coach' : 'player';
          bValue = b.coachedTeamId ? 'coach' : 'player';
          break;
        case 'team':
          aValue = a.team?.name?.toLowerCase() || '';
          bValue = b.team?.name?.toLowerCase() || '';
          break;
        case 'jersey':
          aValue = a.jerseyNumber || 0;
          bValue = b.jerseyNumber || 0;
          break;
        default:
          aValue = a.user?.fullName?.toLowerCase() || '';
          bValue = b.user?.fullName?.toLowerCase() || '';
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredParticipants, sortField, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedParticipants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedParticipants.length);
  const currentParticipants = sortedParticipants.slice(startIndex, endIndex);

  // Fetch tournaments initially; teams/participants load per selected tournament
  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const tourRes = await fetch('http://localhost:5000/api/tournaments', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!tourRes.ok) throw new Error('Failed to load tournaments');
        const tourData = await tourRes.json();

        const resolvedTournaments = Array.isArray(tourData) ? tourData : (tourData.tournaments || tourData.tournaments || []);
        setTournaments(resolvedTournaments || []);

        if (resolvedTournaments && resolvedTournaments.length > 0) {
          setSelectedTournamentId(prev => prev || resolvedTournaments[0].id);
          setSelectedTournament(prev => prev || resolvedTournaments[0]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load tournaments');
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  // Load teams, participants and coaches for the selected tournament
  useEffect(() => {
    if (!selectedTournamentId) return;

    const fetchTournamentData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const teamRes = await fetch(`http://localhost:5000/api/teams?tournamentId=${selectedTournamentId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!teamRes.ok) throw new Error('Failed to load teams');
        const teamData = await teamRes.json();
        setTeams(Array.isArray(teamData) ? teamData : teamData.teams || []);

        const partRes = await fetch(`http://localhost:5000/api/participants?tournamentId=${selectedTournamentId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!partRes.ok) throw new Error('Failed to load participants');
        const partData = await partRes.json();
        setParticipants(Array.isArray(partData) ? partData : partData.participants || []);

        const coachesRes = await fetch('http://localhost:5000/api/users?role=coach', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (coachesRes.ok) {
          const coachesData = await coachesRes.json();
          setAvailableCoaches(Array.isArray(coachesData) ? coachesData : coachesData.users || []);
        }
        // also fetch registered users for participant selection
        const usersRes = await fetch('http://localhost:5000/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setRegisteredUsers(Array.isArray(usersData) ? usersData : usersData.users || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentData();
  }, [selectedTournamentId]);

  // Team Functions
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(teamForm),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create team');
      }

      const newTeam = await res.json();
      setTeams(prev => [...prev, newTeam.team || newTeam]);
      setShowCreateTeamModal(false);
      setTeamForm({
        name: '',
        shortName: '',
        department: '',
        color: '#7C3AED',
        logo: '',
        tournamentId: '',
        coachId: '',
      });

      setSuccess('Team created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTeam = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/teams/${selectedTeam.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(teamForm),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update team');
      }

      const updatedTeam = await res.json();
      setTeams(prev => prev.map(team => 
        team.id === selectedTeam.id ? (updatedTeam.team || updatedTeam) : team
      ));
      setShowEditTeamModal(false);
      setSelectedTeam(null);

      setSuccess('Team updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeam = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      if (!selectedTeam || !selectedTeam.id) throw new Error('No team selected');
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/teams/${selectedTeam.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        let errMsg = `Failed to delete team (status ${res.status})`;
        try {
          const errData = await res.json();
          errMsg = errData.error || errData.message || errMsg;
        } catch (parseErr) {
          console.error('Failed to parse delete team error body', parseErr);
        }
        console.error('Delete team failed', res.status);
        throw new Error(errMsg);
      }

      setTeams(prev => prev.filter(team => team.id !== selectedTeam.id));
      setShowDeleteTeamModal(false);
      setSelectedTeam(null);

      setSuccess('Team deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditTeamModal = (team) => {
    setSelectedTeam(team);
    setTeamForm({
      name: team.name,
      shortName: team.shortName || '',
      department: team.department || '',
      color: team.color || '#7C3AED',
      logo: team.logo || '',
      tournamentId: team.tournamentId || '',
      coachId: team.coachId || '',
    });
    setShowEditTeamModal(true);
  };

  const openDeleteTeamModal = (team) => {
    setSelectedTeam(team);
    setShowDeleteTeamModal(true);
  };

  // Participant Functions
  const handleAddParticipant = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      // prefer existing user if selected
      // ensure we have a userId — prefer explicit selection, else try match by email
      let userId = newParticipantForm.userId;
      if (!userId && newParticipantForm.email) {
        const found = registeredUsers.find(u => (u.email || '').toLowerCase() === newParticipantForm.email.toLowerCase());
        if (found) userId = found.id;
      }

      if (!userId) {
        // create a team-member record (no User account)
        const tmRes = await fetch('http://localhost:5000/api/team-members', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            teamId: newParticipantForm.teamId,
            tournamentId: selectedTournamentId,
            fullName: newParticipantForm.fullName,
            email: newParticipantForm.email,
            phone: newParticipantForm.phone,
            role: newParticipantForm.role,
            jerseyNumber: newParticipantForm.jerseyNumber || null,
            position: newParticipantForm.position || null,
          }),
        });

        if (!tmRes.ok) {
          const err = await tmRes.json().catch(() => ({}));
          throw new Error(err.error || err.message || 'Failed to add team member');
        }

        const created = await tmRes.json();
        const member = created.member;

        // Map team member to participant-like object for UI
        const participantLike = {
          id: member.id,
          user: { fullName: member.fullName, email: member.email },
          teamId: member.teamId,
          tournamentId: member.tournamentId,
          jerseyNumber: member.jerseyNumber,
          position: member.position,
          coachedTeamId: member.role === 'coach' ? member.teamId : null,
        };

        setParticipants(prev => [...prev, participantLike]);
        setShowAddParticipantModal(false);
        setNewParticipantForm({
          fullName: '',
          email: '',
          phone: '',
          role: 'player',
          userId: '',
          teamId: '',
          jerseyNumber: '',
          position: ''
        });

        setSuccess('Participant added successfully!');
        setTimeout(() => setSuccess(''), 3000);

        return;
      }

      const payload = {
        userId,
        teamId: newParticipantForm.teamId,
        tournamentId: selectedTournamentId,
        jerseyNumber: newParticipantForm.jerseyNumber || null,
        position: newParticipantForm.position || null,
        isCoach: newParticipantForm.role === 'coach',
      };

      const res = await fetch('http://localhost:5000/api/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to add participant');
      }

      const newParticipant = await res.json();
      setParticipants(prev => [...prev, newParticipant.participant || newParticipant]);
      setShowAddParticipantModal(false);
      setNewParticipantForm({
        fullName: '',
        email: '',
        phone: '',
        role: 'player',
        userId: '',
        teamId: '',
        jerseyNumber: '',
        position: ''
      });

      setSuccess('Participant added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditParticipant = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/participants/${selectedParticipant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(participantForm),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update participant');
      }

      const updatedParticipant = await res.json();
      setParticipants(prev => prev.map(participant => 
        participant.id === selectedParticipant.id ? (updatedParticipant.participant || updatedParticipant) : participant
      ));
      setShowEditParticipantModal(false);
      setSelectedParticipant(null);

      setSuccess('Participant updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteParticipant = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      if (!selectedParticipant || !selectedParticipant.id) throw new Error('No participant selected');
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/participants/${selectedParticipant.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        let errMsg = `Failed to delete participant (status ${res.status})`;
        try {
          const errData = await res.json();
          errMsg = errData.error || errData.message || errMsg;
        } catch (parseErr) {
          console.error('Failed to parse delete participant error body', parseErr);
        }
        console.error('Delete participant failed', res.status);
        throw new Error(errMsg);
      }

      setParticipants(prev => prev.filter(participant => participant.id !== selectedParticipant.id));
      setShowDeleteParticipantModal(false);
      setSelectedParticipant(null);

      setSuccess('Participant deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditParticipantModal = (participant) => {
    setSelectedParticipant(participant);
    setParticipantForm({
      userId: participant.userId,
      teamId: participant.teamId || '',
      jerseyNumber: participant.jerseyNumber || '',
      position: participant.position || '',
      role: participant.coachedTeamId ? 'coach' : 'player'
    });
    setShowEditParticipantModal(true);
  };

  const openDeleteParticipantModal = (participant) => {
    setSelectedParticipant(participant);
    setShowDeleteParticipantModal(true);
  };

  // Utility Functions
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
        className="px-3 py-1.5 rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
        className="px-3 py-1.5 rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
          className={`px-3 py-1.5 min-w-[2.5rem] rounded-md transition ${
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
        className="px-3 py-1.5 rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
        className="px-3 py-1.5 rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronsRight size={16} />
      </button>
    );
    
    return buttons;
  };

  // Available positions for select dropdown
  const positions = ['GK', 'DEF', 'MID', 'FWD'];

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

      {/* Header + Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <UsersRound className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Teams & Participants</h1>
              <p className="text-gray-600 mt-1">Manage teams, players, coaches and assignments</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center">
            <select
              value={selectedTournamentId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedTournamentId(id);
                const found = tournaments.find(t => String(t.id) === String(id));
                setSelectedTournament(found || null);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white mr-2"
            >
              <option value="">All Tournaments</option>
              {tournaments.map(t => (
                <option key={t.id} value={t.id}>{t.name}{t.season ? ` (${t.season})` : ''}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'teams' 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={18} />
              Manage Teams
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('participants');
              setCurrentPage(1);
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'participants' 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <User size={18} />
              Players & Coaches
            </div>
          </button>
          <button
            onClick={() => setActiveTab('positions')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'positions' 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Crown size={18} />
              Positions
            </div>
          </button>
        </div>
      </div>

      {/* Manage Teams Tab */}
      {activeTab === 'teams' && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">All Teams</h2>
              <p className="text-gray-600 mt-1">Create and manage tournament teams</p>
            </div>
            <button
              onClick={() => setShowCreateTeamModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Create New Team
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600">Loading teams...</p>
            </div>
          ) : error ? (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-500" size={24} />
                <div>
                  <h3 className="font-bold text-lg">Error Loading Data</h3>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center p-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <UsersRound className="text-gray-400" size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Teams Yet</h3>
              <p className="text-gray-500 mb-6">Create your first team to get started</p>
              <button
                onClick={() => setShowCreateTeamModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg"
              >
                Create Team
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teams.map(t => (
                <div 
                  key={t.id}
                  className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: t.color || '#7C3AED' }}></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{t.name}</h3>
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                          <span className="font-medium px-2 py-0.5 bg-gray-100 rounded-md">{t.shortName}</span>
                          <span className="text-gray-400">•</span>
                          <span>{t.department}</span>
                        </p>
                      </div>
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: t.color || '#7C3AED' }}
                      >
                        {t.logo ? (
                          <img src={t.logo} alt={t.name} className="w-10 h-10 object-contain" />
                        ) : (
                          t.shortName?.[0] || t.name?.[0]
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium text-gray-500 mb-1">Tournament</p>
                        <p className="font-semibold text-gray-900">{t.tournament?.name || '—'}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium text-gray-500 mb-1">Coach</p>
                        <p className="font-semibold text-gray-900">{t.coach?.user?.fullName || 'No coach'}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => openEditTeamModal(t)}
                          className="flex-1 bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 font-medium py-2.5 rounded-xl transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                        >
                          <Edit size={16} />
                          Edit Team
                        </button>
                        <button 
                          onClick={() => { setTeamMembersModalTeam(t); setShowTeamMembersModal(true); }}
                          className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-emerald-700 font-medium py-2.5 rounded-xl transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                        >
                          <Users size={16} />
                          View Members
                        </button>
                      <button 
                        onClick={() => openDeleteTeamModal(t)}
                        className="p-2.5 text-red-600 hover:text-red-700 rounded-xl hover:bg-red-50 transition-all duration-300 group"
                      >
                        <Trash2 size={18} className="group-hover:rotate-12 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Players & Coaches Tab */}
      {activeTab === 'participants' && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">All Players & Coaches</h2>
              <p className="text-gray-600 mt-1">Manage tournament participants and assignments</p>
            </div>
            <button 
              onClick={() => setShowAddParticipantModal(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
            >
              <UserPlus size={20} />
              Add Participant
            </button>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name, email, or team..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="player">Players Only</option>
                  <option value="coach">Coaches Only</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{startIndex + 1}-{endIndex}</span> of{' '}
                <span className="font-semibold">{sortedParticipants.length}</span> participants
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Items per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600">Loading participants...</p>
            </div>
          ) : error ? (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-500" size={24} />
                <div>
                  <h3 className="font-bold text-lg">Error Loading Data</h3>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          ) : sortedParticipants.length === 0 ? (
            <div className="text-center p-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <User className="text-gray-400" size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Participants Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || roleFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Start by adding participants to your teams'}
              </p>
              <button 
                onClick={() => setShowAddParticipantModal(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg"
              >
                Add Participant
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
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center gap-2">
                            Name
                            {sortField === 'name' && (
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
                          onClick={() => handleSort('team')}
                        >
                          <div className="flex items-center gap-2">
                            Team
                            {sortField === 'team' && (
                              <span className="text-indigo-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => handleSort('jersey')}
                        >
                          <div className="flex items-center gap-2">
                            Jersey #
                            {sortField === 'jersey' && (
                              <span className="text-indigo-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-r-xl">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentParticipants.map(p => (
                        <tr key={p.id} className="hover:bg-gradient-to-r from-gray-50 to-gray-100 transition-all duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                <User size={18} className="text-indigo-600" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">{p.user?.fullName}</div>
                                <div className="text-sm text-gray-500">{p.user?.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${
                              p.coachedTeamId 
                                ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200' 
                                : 'bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}>
                              {p.coachedTeamId ? (
                                <div className="flex items-center gap-1.5">
                                  <Crown size={12} />
                                  Coach
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <User size={12} />
                                  Player
                                </div>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.team?.color || '#7C3AED' }}></div>
                              <span className="text-sm font-medium text-gray-900">{p.team?.name || '—'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {p.jerseyNumber ? (
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center mx-auto">
                                <span className="font-bold text-gray-800">{p.jerseyNumber}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                              p.position === 'GK' ? 'bg-blue-100 text-blue-800' :
                              p.position === 'DEF' ? 'bg-green-100 text-green-800' :
                              p.position === 'MID' ? 'bg-yellow-100 text-yellow-800' :
                              p.position === 'FWD' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {p.position || '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => openEditParticipantModal(p)}
                                className="p-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 hover:text-blue-800 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-110"
                              >
                                <Edit size={18} />
                              </button>
                              <button 
                                onClick={() => openDeleteParticipantModal(p)}
                                className="p-2 bg-gradient-to-r from-red-50 to-red-100 text-red-600 hover:text-red-800 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-110"
                              >
                                <UserMinus size={18} />
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
                    <span className="font-semibold">{sortedParticipants.length}</span> total participants
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
                      className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Player Positions Tab */}
      {activeTab === 'positions' && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-200 p-8 transform transition-all duration-300 hover:shadow-3xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg mb-6">
              <Crown className="text-white" size={36} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Player Positions Reference</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These are the standard positions used in the league (enum in database).
              Coaches assign positions when adding players to teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 rounded-2xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-blue-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-lg">
                <Shield size={40} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">GK - Goalkeeper</h3>
              <p className="text-gray-600 mb-4">
                Primary role: save shots, organize defense
              </p>
              <div className="inline-flex px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm">
                1 position per team
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-emerald-50 border-2 border-emerald-100 rounded-2xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-emerald-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center shadow-lg">
                <Users size={40} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">DEF - Defender</h3>
              <p className="text-gray-600 mb-4">
                Prevent goals, win tackles, start attacks
              </p>
              <div className="inline-flex px-4 py-2 bg-emerald-100 text-emerald-800 font-semibold rounded-full text-sm">
                3-5 positions per team
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-amber-50 border-2 border-amber-100 rounded-2xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-amber-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center shadow-lg">
                <Trophy size={40} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">MID - Midfielder</h3>
              <p className="text-gray-600 mb-4">
                Control game, link defense & attack, box-to-box
              </p>
              <div className="inline-flex px-4 py-2 bg-amber-100 text-amber-800 font-semibold rounded-full text-sm">
                3-5 positions per team
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-rose-50 border-2 border-rose-100 rounded-2xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-rose-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center shadow-lg">
                <Goal size={40} className="text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">FWD - Forward</h3>
              <p className="text-gray-600 mb-4">
                Score goals, create chances, finish attacks
              </p>
              <div className="inline-flex px-4 py-2 bg-rose-100 text-rose-800 font-semibold rounded-full text-sm">
                1-3 positions per team
              </div>
            </div>
          </div>

          <div className="text-center p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
            <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-white rounded-full shadow-md">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <AlertTriangle size={16} className="text-indigo-600" />
              </div>
              <p className="text-gray-700 font-medium">
                Positions are fixed in the database (enum PlayerPosition).
              </p>
            </div>
            <p className="text-gray-500">
              You can assign these positions when adding players to teams. Each position has specific rules and limitations.
            </p>
          </div>
        </div>
      )}

      {/* ========== MODALS ========== */}

      {/* Create Team Modal */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="sticky top-0 bg-white z-10 rounded-t-3xl border-b border-gray-200 p-8 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Create New Team</h2>
                <p className="text-gray-600 mt-1">Fill in the details below to create a new team</p>
              </div>
              <button 
                onClick={() => setShowCreateTeamModal(false)}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X size={28} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Existing Registered User (optional)</label>
                      <select
                        value={newParticipantForm.userId}
                        onChange={e => {
                          const userId = e.target.value;
                          const user = registeredUsers.find(u => String(u.id) === String(userId));
                          setNewParticipantForm(prev => ({
                            ...prev,
                            userId: userId || '',
                            fullName: user ? user.fullName : '',
                            email: user ? user.email : '',
                            phone: user ? user.phone || '' : prev.phone,
                          }));
                        }}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300 appearance-none bg-white"
                      >
                        <option value="">Select existing user</option>
                        {registeredUsers.map(u => (
                          <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>
                        ))}
                      </select>
                    </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Team Name *</label>
                    <input
                      type="text"
                      value={teamForm.name}
                      onChange={e => setTeamForm({...teamForm, name: e.target.value})}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
                      placeholder="Enter team name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Short Name (optional)</label>
                    <input
                      type="text"
                      value={teamForm.shortName}
                      onChange={e => setTeamForm({...teamForm, shortName: e.target.value})}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
                      placeholder="e.g. ASTU FC"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Department *</label>
                    <input
                      type="text"
                      value={teamForm.department}
                      onChange={e => setTeamForm({...teamForm, department: e.target.value})}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
                      placeholder="e.g. Computer Science"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Team Color</label>
                    <div className="flex gap-4 items-center">
                      <input
                        type="color"
                        value={teamForm.color}
                        onChange={e => setTeamForm({...teamForm, color: e.target.value})}
                        className="w-16 h-16 rounded-2xl border-2 border-gray-300 cursor-pointer"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={teamForm.color}
                          onChange={e => setTeamForm({...teamForm, color: e.target.value})}
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
                          placeholder="#7C3AED"
                        />
                        <p className="text-sm text-gray-500 mt-2">Used for team badges and visual identity</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Logo URL (optional)</label>
                    <input
                      type="url"
                      value={teamForm.logo}
                      onChange={e => setTeamForm({...teamForm, logo: e.target.value})}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
                      placeholder="https://example.com/logo.png"
                    />
                    {teamForm.logo && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">Logo Preview:</p>
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                          <img src={teamForm.logo} alt="Logo preview" className="w-full h-full object-contain" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Tournament *</label>
                  <select
                    value={teamForm.tournamentId}
                    onChange={e => setTeamForm({...teamForm, tournamentId: e.target.value})}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300 appearance-none bg-white"
                    required
                  >
                    <option value="">Select Tournament</option>
                    {tournaments.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.season})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Coach (optional)</label>
                  <select
                    value={teamForm.coachId}
                    onChange={e => setTeamForm({...teamForm, coachId: e.target.value})}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300 appearance-none bg-white"
                  >
                    <option value="">No coach yet</option>
                    {availableCoaches.map(coach => (
                      <option key={coach.id} value={coach.id}>
                        {coach.fullName} ({coach.email})
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-2">Can be assigned later</p>
                </div>
              </div>

              <div className="flex justify-end gap-6 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateTeamModal(false)}
                  className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Create Team
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {showEditTeamModal && selectedTeam && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="sticky top-0 bg-white z-10 rounded-t-3xl border-b border-gray-200 p-8 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Edit Team</h2>
                <p className="text-gray-600 mt-1">Update team details</p>
              </div>
              <button 
                onClick={() => setShowEditTeamModal(false)}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors duration-200"
                disabled={isSubmitting}
              >
                <X size={28} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleEditTeam} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Team Name *</label>
                    <input
                      type="text"
                      value={teamForm.name}
                      onChange={e => setTeamForm({...teamForm, name: e.target.value})}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Short Name (optional)</label>
                    <input
                      type="text"
                      value={teamForm.shortName}
                      onChange={e => setTeamForm({...teamForm, shortName: e.target.value})}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
                      placeholder="e.g. ASTU FC"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Department *</label>
                    <input
                      type="text"
                      value={teamForm.department}
                      onChange={e => setTeamForm({...teamForm, department: e.target.value})}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Team Color</label>
                    <div className="flex gap-4 items-center">
                      <input
                        type="color"
                        value={teamForm.color}
                        onChange={e => setTeamForm({...teamForm, color: e.target.value})}
                        className="w-16 h-16 rounded-2xl border-2 border-gray-300 cursor-pointer"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={teamForm.color}
                          onChange={e => setTeamForm({...teamForm, color: e.target.value})}
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Logo URL (optional)</label>
                    <input
                      type="url"
                      value={teamForm.logo}
                      onChange={e => setTeamForm({...teamForm, logo: e.target.value})}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Tournament *</label>
                  <select
                    value={teamForm.tournamentId}
                    onChange={e => setTeamForm({...teamForm, tournamentId: e.target.value})}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300 appearance-none bg-white"
                    required
                  >
                    <option value="">Select Tournament</option>
                    {tournaments.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.season})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Coach (optional)</label>
                  <select
                    value={teamForm.coachId}
                    onChange={e => setTeamForm({...teamForm, coachId: e.target.value})}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300 appearance-none bg-white"
                  >
                    <option value="">No coach yet</option>
                    {availableCoaches.map(coach => (
                      <option key={coach.id} value={coach.id}>
                        {coach.fullName} ({coach.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-6 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditTeamModal(false)}
                  className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Update Team
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Team Modal */}
      {showDeleteTeamModal && selectedTeam && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-slideUp">
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Delete Team</h2>
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete <span className="font-bold text-indigo-700">{selectedTeam.name}</span>?
              </p>
              <p className="text-sm text-red-600 mb-6">
                This action cannot be undone. All team data and participant assignments will be permanently removed.
              </p>
              
              <div className="flex justify-center gap-4 pt-6">
                <button
                  onClick={() => setShowDeleteTeamModal(false)}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTeam}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 font-semibold shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Delete Team
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Participant Modal */}
      {showAddParticipantModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="sticky top-0 bg-white z-10 rounded-t-3xl border-b border-gray-200 p-8 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Add New Participant</h2>
                <p className="text-gray-600 mt-1">Register a new player or coach</p>
              </div>
              <button 
                onClick={() => setShowAddParticipantModal(false)}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X size={28} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleAddParticipant} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name *</label>
                    <input
                      type="text"
                      value={newParticipantForm.fullName}
                      onChange={e => setNewParticipantForm({...newParticipantForm, fullName: e.target.value})}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
                      placeholder="Enter full name"
                      required={!newParticipantForm.userId}
                      disabled={!!newParticipantForm.userId}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Email Address *</label>
                    <input
                      type="email"
                      value={newParticipantForm.email}
                      onChange={e => setNewParticipantForm({...newParticipantForm, email: e.target.value})}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
                      placeholder="participant@example.com"
                      required={!newParticipantForm.userId}
                      disabled={!!newParticipantForm.userId}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Phone Number</label>
                    <input
                      type="tel"
                      value={newParticipantForm.phone}
                      onChange={e => setNewParticipantForm({...newParticipantForm, phone: e.target.value})}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Role *</label>
                    <select
                      value={newParticipantForm.role}
                      onChange={e => setNewParticipantForm({...newParticipantForm, role: e.target.value})}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300 appearance-none bg-white"
                      required
                    >
                      <option value="player">Player</option>
                      <option value="coach">Coach</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Team *</label>
                    <select
                      value={newParticipantForm.teamId}
                      onChange={e => setNewParticipantForm({...newParticipantForm, teamId: e.target.value})}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300 appearance-none bg-white"
                      required
                    >
                      <option value="">Select Team</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.id}>
                          {team.name} ({team.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  {newParticipantForm.role === 'player' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Jersey Number</label>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={newParticipantForm.jerseyNumber}
                          onChange={e => setNewParticipantForm({...newParticipantForm, jerseyNumber: e.target.value})}
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
                          placeholder="e.g., 7"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Position</label>
                        <select
                          value={newParticipantForm.position}
                          onChange={e => setNewParticipantForm({...newParticipantForm, position: e.target.value})}
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300 appearance-none bg-white"
                        >
                          <option value="">Select Position</option>
                          {positions.map(pos => (
                            <option key={pos} value={pos}>{pos}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-6 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddParticipantModal(false)}
                  className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Adding...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      Add Participant
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Members Modal */}
      {showTeamMembersModal && teamMembersModalTeam && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto animate-slideUp">
            <div className="sticky top-0 bg-white z-10 rounded-t-3xl border-b border-gray-200 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Team Members — {teamMembersModalTeam.name}</h2>
                <p className="text-gray-600 mt-1">Members registered for this team</p>
              </div>
              <button 
                onClick={() => { setShowTeamMembersModal(false); setTeamMembersModalTeam(null); }}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {participants.filter(p => p.teamId === teamMembersModalTeam.id).length === 0 ? (
                <div className="text-center p-12 bg-white/80 rounded-xl border border-gray-200">
                  <p className="text-gray-500">No members found for this team.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jersey</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {participants.filter(p => p.teamId === teamMembersModalTeam.id).map(p => (
                        <tr key={p.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.user?.fullName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.user?.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.coachedTeamId ? 'Coach' : 'Player'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.jerseyNumber || '—'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.position || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Participant Modal */}
      {showEditParticipantModal && selectedParticipant && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="sticky top-0 bg-white z-10 rounded-t-3xl border-b border-gray-200 p-8 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Edit Participant</h2>
                <p className="text-gray-600 mt-1">Update participant details</p>
              </div>
              <button 
                onClick={() => setShowEditParticipantModal(false)}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors duration-200"
                disabled={isSubmitting}
              >
                <X size={28} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleEditParticipant} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name</label>
                    <input
                      type="text"
                      value={selectedParticipant.user?.fullName || ''}
                      disabled
                      className="w-full px-5 py-4 border-2 border-gray-200 bg-gray-50 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Email</label>
                    <input
                      type="email"
                      value={selectedParticipant.user?.email || ''}
                      disabled
                      className="w-full px-5 py-4 border-2 border-gray-200 bg-gray-50 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Team *</label>
                    <select
                      value={participantForm.teamId}
                      onChange={e => setParticipantForm({...participantForm, teamId: e.target.value})}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300 appearance-none bg-white"
                      required
                    >
                      <option value="">Select Team</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.id}>
                          {team.name} ({team.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  {participantForm.role === 'player' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Jersey Number</label>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={participantForm.jerseyNumber}
                          onChange={e => setParticipantForm({...participantForm, jerseyNumber: e.target.value})}
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300"
                          placeholder="e.g., 7"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Position</label>
                        <select
                          value={participantForm.position}
                          onChange={e => setParticipantForm({...participantForm, position: e.target.value})}
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-300 appearance-none bg-white"
                        >
                          <option value="">Select Position</option>
                          {positions.map(pos => (
                            <option key={pos} value={pos}>{pos}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-6 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditParticipantModal(false)}
                  className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Update Participant
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Participant Modal */}
      {showDeleteParticipantModal && selectedParticipant && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-slideUp">
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <UserMinus className="text-red-600" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Remove Participant</h2>
              <p className="text-gray-600 mb-2">
                Are you sure you want to remove <span className="font-bold text-indigo-700">{selectedParticipant.user?.fullName}</span>?
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Role: <span className="font-semibold">{selectedParticipant.coachedTeamId ? 'Coach' : 'Player'}</span>
                {selectedParticipant.team?.name && (
                  <> • Team: <span className="font-semibold">{selectedParticipant.team.name}</span></>
                )}
              </p>
              <p className="text-sm text-red-600 mb-6">
                This will remove their assignment from the tournament.
              </p>
              
              <div className="flex justify-center gap-4 pt-6">
                <button
                  onClick={() => setShowDeleteParticipantModal(false)}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteParticipant}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 font-semibold shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Removing...
                    </>
                  ) : (
                    <>
                      <UserMinus size={18} />
                      Remove Participant
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add custom animations */}
      <style>{`
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