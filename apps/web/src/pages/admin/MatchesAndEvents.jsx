// src/pages/admin/MatchesAndEvents.jsx
import { useEffect, useState } from 'react';
import { 
  CalendarDays, Plus, Clock, Goal, Edit, Trash2, AlertTriangle, Search, 
  Filter, ChevronDown, X, Check, Users, Trophy, Save 
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export default function MatchesAndEvents() {
  const [activeTab, setActiveTab] = useState('matches');
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchEvents, setMatchEvents] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateMatchModal, setShowCreateMatchModal] = useState(false);

  const [matchForm, setMatchForm] = useState({
    tournamentId: '',
    homeTeamId: '',
    awayTeamId: '',
    date: '',
    time: '',
    venue: 'Main Stadium',
    matchweek: 1,
    status: 'SCHEDULED',
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        // 1. Fetch tournaments
        const tourRes = await fetch(`${API_BASE_URL}/tournaments`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!tourRes.ok) throw new Error('Failed to load tournaments');
        const tourData = await tourRes.json();
        
        // Handle different response shapes
        const tourList = Array.isArray(tourData) ? tourData : tourData.tournaments || tourData.data || [];
        setTournaments(tourList);
        console.log('Tournaments loaded:', tourList); // ← debug: check this in browser console

        // 2. Fetch teams (for team dropdowns)
        const teamRes = await fetch(`${API_BASE_URL}/teams`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!teamRes.ok) throw new Error('Failed to load teams');
        const teamData = await teamRes.json();
        const teamList = Array.isArray(teamData) ? teamData : teamData.teams || [];
        setTeams(teamList);

        // 3. Fetch matches
        const matchRes = await fetch(`${API_BASE_URL}/matches`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!matchRes.ok) throw new Error('Failed to load matches');
        const matchData = await matchRes.json();
        setMatches(Array.isArray(matchData) ? matchData : []);

      } catch (err) {
        setError(err.message || 'Failed to load data');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch events for selected match
  useEffect(() => {
    if (!selectedMatch?.id) return;

    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/match-events?matchId=${selectedMatch.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to load events');
        const data = await res.json();
        setMatchEvents(Array.isArray(data) ? data : data.events || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEvents();
  }, [selectedMatch]);

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    setError('');

    if (!matchForm.tournamentId) {
      setError('Please select a tournament');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...matchForm,
          date: new Date(matchForm.date).toISOString(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create match');
      }

      const newMatch = await res.json();
      setMatches(prev => [...prev, newMatch.match || newMatch]);
      setShowCreateMatchModal(false);
      setMatchForm({
        tournamentId: '',
        homeTeamId: '',
        awayTeamId: '',
        date: '',
        time: '',
        venue: 'Main Stadium',
        matchweek: 1,
        status: 'SCHEDULED',
      });

      alert('Match scheduled successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header + Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Matches & Events</h1>
          <p className="text-gray-600 mt-1">Schedule fixtures, update scores and record events</p>
        </div>

        <div className="flex gap-3 bg-white p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'matches' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Matches & Fixtures
          </button>
          <button
            onClick={() => setActiveTab('events')}
            disabled={!selectedMatch}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'events' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100 disabled:opacity-50'
            }`}
          >
            Match Events & Goals
          </button>
        </div>
      </div>

      {/* Matches Tab */}
      {activeTab === 'matches' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">All Fixtures</h2>
            <button
              onClick={() => setShowCreateMatchModal(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium shadow-md"
            >
              <Plus size={20} />
              Schedule Match
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
          ) : matches.length === 0 ? (
            <div className="text-center text-gray-500 p-12 bg-white rounded-xl shadow">
              No matches scheduled yet.
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date / Time</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Match</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Venue</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Week</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {matches.map(m => (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(m.date).toLocaleDateString()} {m.time || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {m.homeTeam?.name || 'TBD'} vs {m.awayTeam?.name || 'TBD'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                          {m.venue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            m.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                            m.status === 'LIVE' ? 'bg-green-100 text-green-800' :
                            m.status === 'FINISHED' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                          {m.matchweek || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center gap-3">
                            <button 
                              onClick={() => setSelectedMatch(m)}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              <Goal size={18} />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800">
                              <Edit size={18} />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
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
          )}
        </>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div>
          {!selectedMatch ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center text-gray-600">
              Select a match from the "Matches & Fixtures" tab to manage events
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Events: {selectedMatch.homeTeam?.name || 'TBD'} vs {selectedMatch.awayTeam?.name || 'TBD'}
                </h2>
                <button
                  onClick={() => alert('Add event form coming soon')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium shadow-md"
                >
                  <Plus size={20} />
                  Add Event
                </button>
              </div>

              {/* Current Score */}
              <div className="bg-white rounded-xl shadow border p-6">
                <div className="flex justify-center items-center gap-12 text-4xl font-bold">
                  <div className="text-center">
                    <p className="text-2xl mb-2">{selectedMatch.homeTeam?.name || 'TBD'}</p>
                    <p>{selectedMatch.homeGoals || 0}</p>
                  </div>
                  <div className="text-5xl text-gray-400">:</div>
                  <div className="text-center">
                    <p className="text-2xl mb-2">{selectedMatch.awayTeam?.name || 'TBD'}</p>
                    <p>{selectedMatch.awayGoals || 0}</p>
                  </div>
                </div>
                <div className="text-center mt-4 text-gray-600">
                  {new Date(selectedMatch.date).toLocaleString()} • {selectedMatch.venue}
                </div>
              </div>

              {/* Events Timeline - placeholder */}
              <div className="bg-white rounded-xl shadow border p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Match Events</h3>
                <p className="text-gray-600">No events recorded yet</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Match Modal */}
      {showCreateMatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">Schedule New Match</h2>
              <button onClick={() => setShowCreateMatchModal(false)}>
                <X size={28} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleCreateMatch} className="p-6 space-y-6">
              {/* Tournament */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tournament *</label>
                <select
                  value={matchForm.tournamentId}
                  onChange={e => setMatchForm({...matchForm, tournamentId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Tournament</option>
                  {tournaments.length > 0 ? (
                    tournaments.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.season})
                      </option>
                    ))
                  ) : (
                    <option disabled>No tournaments available</option>
                  )}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={matchForm.date}
                    onChange={e => setMatchForm({...matchForm, date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={matchForm.time}
                    onChange={e => setMatchForm({...matchForm, time: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Teams */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Home Team *</label>
                  <select
                    value={matchForm.homeTeamId}
                    onChange={e => setMatchForm({...matchForm, homeTeamId: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Home Team</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Away Team *</label>
                  <select
                    value={matchForm.awayTeamId}
                    onChange={e => setMatchForm({...matchForm, awayTeamId: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Away Team</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Venue & Matchweek */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                  <input
                    type="text"
                    value={matchForm.venue}
                    onChange={e => setMatchForm({...matchForm, venue: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Main Stadium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matchweek</label>
                  <input
                    type="number"
                    value={matchForm.matchweek}
                    onChange={e => setMatchForm({...matchForm, matchweek: Number(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="1"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={matchForm.status}
                  onChange={e => setMatchForm({...matchForm, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="LIVE">Live</option>
                  <option value="FINISHED">Finished</option>
                  <option value="POSTPONED">Postponed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateMatchModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm flex items-center gap-2"
                >
                  <CalendarDays size={18} />
                  Schedule Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
