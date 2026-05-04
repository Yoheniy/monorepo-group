// src/pages/admin/TournamentsAndLeagues.jsx
import { useEffect, useState } from 'react';
import { 
  Plus, Trophy, Table, Edit, Trash2, Calendar, Users, AlertTriangle, Search,
  ChevronDown, XCircle, Save
} from 'lucide-react';

export default function TournamentsAndLeagues() {
  const [activeTab, setActiveTab] = useState('tournaments');
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]); // for team selection dropdown
  const [standings, setStandings] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTournamentId, setEditingTournamentId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailTournament, setDetailTournament] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    season: '',
    startDate: '',
    endDate: '',
    sponsors: '',
    maxPlayers: 18,
    teamIds: [], // array of selected team IDs
  });

  // Fetch tournaments + teams on mount
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      // Fetch tournaments
      const tourRes = await fetch('http://localhost:5000/api/tournaments', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!tourRes.ok) throw new Error('Failed to load tournaments');
      const tourData = await tourRes.json();
      setTournaments(Array.isArray(tourData) ? tourData : tourData.tournaments || []);

      // Fetch teams (for selection)
      const teamRes = await fetch('http://localhost:5000/api/teams', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!teamRes.ok) throw new Error('Failed to load teams');
      const teamData = await teamRes.json();
      setTeams(Array.isArray(teamData) ? teamData : teamData.teams || []);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch standings when tournament selected
  useEffect(() => {
    if (!selectedTournament?.id) return;

    const fetchStandings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/standings?tournamentId=${selectedTournament.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to load standings');
        const data = await res.json();
        setStandings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStandings();
  }, [selectedTournament]);

  const handleSaveTournament = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const payload = {
        ...formData,
        teamIds: formData.teamIds.length > 0 ? formData.teamIds : undefined,
      };

      const url = isEditing
        ? `http://localhost:5000/api/tournaments/${editingTournamentId}`
        : 'http://localhost:5000/api/tournaments';

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || (isEditing ? 'Failed to update tournament' : 'Failed to create tournament'));
      }

      const result = await res.json();

      // refresh list from server to keep canonical state
      await fetchData();

      setShowCreateModal(false);
      setIsEditing(false);
      setEditingTournamentId(null);
      setFormData({
        name: '',
        season: '',
        startDate: '',
        endDate: '',
        sponsors: '',
        maxPlayers: 18,
        teamIds: [],
      });
      setNotification({ message: isEditing ? 'Tournament updated successfully!' : 'Tournament created successfully!', type: 'success' });
      setTimeout(() => setNotification(null), 3500);
    } catch (err) {
      setError(err.message || (isEditing ? 'Error updating tournament' : 'Error creating tournament'));
    }
  };

  const handleEditClick = (tournament) => {
    setIsEditing(true);
    setEditingTournamentId(tournament.id);
    setFormData({
      name: tournament.name || '',
      season: tournament.season || '',
      startDate: tournament.startDate ? new Date(tournament.startDate).toISOString().slice(0,10) : '',
      endDate: tournament.endDate ? new Date(tournament.endDate).toISOString().slice(0,10) : '',
      sponsors: tournament.sponsors || '',
      maxPlayers: tournament.maxPlayers || 18,
      teamIds: (tournament.teams || []).map(team => team.id) || [],
    });
    setShowCreateModal(true);
  };

  const handleDeleteTournament = async (id) => {
    if (!confirm('Are you sure you want to delete this tournament?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/tournaments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete tournament');
      await fetchData();
      setNotification({ message: 'Tournament deleted', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setError(err.message || 'Error deleting tournament');
    }
  };

  const handleViewDetails = async (id) => {
    setDetailLoading(true);
    setDetailTournament(null);
    setShowDetailModal(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/tournaments/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load tournament details');
      const data = await res.json();
      setDetailTournament(data.tournament || data);
    } catch (err) {
      setError(err.message || 'Failed to load details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleTeamSelection = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, teamIds: selected });
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Notification */}
      {notification && (
        <div className={`fixed right-6 top-6 z-50 max-w-xs px-4 py-3 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {notification.message}
        </div>
      )}
      {/* Header + Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Tournaments & Leagues</h1>
          <p className="text-gray-600 mt-1">Manage seasons, fixtures and league tables</p>
        </div>

        <div className="flex gap-3 bg-white p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setActiveTab('tournaments')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'tournaments' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Tournaments & Seasons
          </button>
          <button
            onClick={() => setActiveTab('standings')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'standings' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            League Standings
          </button>
        </div>
      </div>

      {/* Tournaments Tab */}
      {activeTab === 'tournaments' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">All Tournaments</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium shadow-md"
            >
              <Plus size={20} />
              Create New Tournament
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center">
              {error}
            </div>
          ) : tournaments.length === 0 ? (
            <div className="text-center text-gray-500 p-12 bg-white rounded-xl shadow">
              No tournaments yet. Create your first season!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((t) => (
                <div 
                  key={t.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{t.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">Season: {t.season}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        t.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {t.isActive ? 'Active' : 'Ended'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-600">
                      <div>
                        <p className="font-medium text-gray-700">Start</p>
                        <p>{t.startDate ? new Date(t.startDate).toLocaleDateString() : '—'}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">End</p>
                        <p>{t.endDate ? new Date(t.endDate).toLocaleDateString() : '—'}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Teams</p>
                        <p>{t.totalClubs || 0}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Max Players</p>
                        <p>{t.maxPlayers || '—'}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button onClick={() => handleViewDetails(t.id)} className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 rounded-lg transition">
                        View Details
                      </button>
                      <button onClick={() => handleEditClick(t)} className="p-2 text-gray-600 hover:text-indigo-700 rounded hover:bg-indigo-50 transition" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteTournament(t.id)} className="p-2 text-red-600 hover:text-red-800 rounded hover:bg-red-50 transition" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Standings Tab */}
      {activeTab === 'standings' && (
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-800">League Standings</h2>

            <div className="relative w-full md:w-80">
              <select 
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
                onChange={(e) => {
                  const id = e.target.value;
                  const selected = tournaments.find(t => t.id === id);
                  setSelectedTournament(selected);
                  setStandings([]); // reset standings
                }}
                value={selectedTournament?.id || ''}
              >
                <option value="">Select Tournament / Season</option>
                {tournaments.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.season})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
            </div>
          </div>

          {!selectedTournament ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center text-gray-600">
              Select a tournament above to view its league standings
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">P</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">D</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GF</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GA</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GD</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pts</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Form</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {standings.length === 0 ? (
                      <tr>
                        <td colSpan="11" className="px-6 py-12 text-center text-gray-500">
                          No matches played yet in {selectedTournament?.name}
                        </td>
                      </tr>
                    ) : (
                      standings
                        .sort((a, b) => b.points - a.points || b.gd - a.gd)
                        .map((team, index) => (
                          <tr key={team.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                                  style={{ backgroundColor: team.color || '#7C3AED' }}
                                >
                                  {team.shortName?.[0] || team.name?.[0] || '?'}
                                </div>
                                <span className="font-medium text-gray-900">{team.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">{team.played || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">{team.won || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">{team.drawn || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">{team.lost || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">{team.gf || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">{team.ga || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                              <span className={team.gd >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {team.gd >= 0 ? '+' : ''}{(team.gd || 0)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900">
                              {team.points || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex gap-1 justify-center">
                                {team.form ? team.form.split('').map((char, i) => (
                                  <span
                                    key={i}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                                      char === 'W' ? 'bg-green-500 text-white' :
                                      char === 'D' ? 'bg-yellow-500 text-white' :
                                      char === 'L' ? 'bg-red-500 text-white' : 'bg-gray-400 text-white'
                                    }`}
                                  >
                                    {char}
                                  </span>
                                )) : <span className="text-gray-400">—</span>}
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Tournament Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">Create New Tournament</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 transition p-1 rounded-full hover:bg-gray-100"
              >
                <XCircle size={28} />
              </button>
            </div>

            <form onSubmit={handleSaveTournament} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tournament Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g. ASTU Premier League"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Season *</label>
                <input
                  type="text"
                  value={formData.season}
                  onChange={e => setFormData({...formData, season: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g. 2025/26"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sponsors (optional)</label>
                <input
                  type="text"
                  value={formData.sponsors}
                  onChange={e => setFormData({...formData, sponsors: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g. Nike, Pepsi, ASTU Sport Office"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Players per Team *</label>
                <input
                  type="number"
                  value={formData.maxPlayers}
                  onChange={e => setFormData({...formData, maxPlayers: Number(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>

              {/* Team selection - multi-select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Teams (optional)</label>
                <select
                  multiple
                  value={formData.teamIds}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData({...formData, teamIds: selected});
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32"
                >
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.department})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple teams</p>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm flex items-center gap-2"
                >
                  <Save size={18} />
                  {isEditing ? 'Save Changes' : 'Create Tournament'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">Tournament Details</h2>
              <button 
                onClick={() => { setShowDetailModal(false); setDetailTournament(null); }}
                className="text-gray-500 hover:text-gray-700 transition p-1 rounded-full hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="p-6">
              {detailLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : detailTournament ? (
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{detailTournament.name}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm text-gray-600">Season: <span className="font-semibold text-gray-800">{detailTournament.season}</span></span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${detailTournament.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{detailTournament.isActive ? 'Active' : 'Ended'}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-3">{detailTournament.sponsors || 'No sponsors'}</p>
                      <p className="text-sm text-gray-600">{detailTournament.startDate ? new Date(detailTournament.startDate).toLocaleDateString() : '—'} — {detailTournament.endDate ? new Date(detailTournament.endDate).toLocaleDateString() : '—'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Teams</div>
                      <div className="mt-2 flex flex-wrap gap-2 justify-end">
                        {(detailTournament.teams || []).length > 0 ? (
                          detailTournament.teams.map(team => (
                            <div key={team.id} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-3 py-1 text-sm">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold" style={{backgroundColor: team.color || '#6B21A8'}}>
                                {team.shortName ? team.shortName[0] : (team.name ? team.name[0] : '?')}
                              </div>
                              <div className="font-medium text-gray-800">{team.shortName || team.name}</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500">No teams linked</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-100 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Overview</h4>
                      <div className="text-sm text-gray-600 space-y-2">
                        <div><span className="font-medium text-gray-800">Total Teams:</span> {detailTournament.totalClubs || (detailTournament.teams ? detailTournament.teams.length : 0)}</div>
                        <div><span className="font-medium text-gray-800">Max Players:</span> {detailTournament.maxPlayers || '—'}</div>
                        <div><span className="font-medium text-gray-800">Created:</span> {detailTournament.createdAt ? new Date(detailTournament.createdAt).toLocaleDateString() : '—'}</div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Recent Matches</h4>
                      {detailTournament.matches && detailTournament.matches.length > 0 ? (
                        <div className="space-y-3">
                          {detailTournament.matches.map(m => (
                            <div key={m.id} className="p-3 border rounded-lg flex items-center justify-between">
                              <div>
                                <div className="font-medium">{m.homeTeam?.name || 'Home'} <span className="text-gray-400">vs</span> {m.awayTeam?.name || 'Away'}</div>
                                <div className="text-sm text-gray-500">{m.date ? new Date(m.date).toLocaleString() : 'Date TBA'}</div>
                              </div>
                              <div className="text-lg font-semibold text-gray-800">{m.homeScore != null && m.awayScore != null ? `${m.homeScore} - ${m.awayScore}` : (m.score || '')}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No matches available</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">Failed to load details</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}