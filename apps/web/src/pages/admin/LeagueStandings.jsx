// src/pages/admin/LeagueStandings.jsx
import { useEffect, useState } from 'react';
import { 
  Table, Trophy, ChevronDown, AlertTriangle, RefreshCw, Search 
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export default function LeagueStandings() {
  const [tournaments, setTournaments] = useState([]);
  const [standings, setStandings] = useState([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all tournaments on mount
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const res = await fetch(`${API_BASE_URL}/tournaments`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to load tournaments');
        const data = await res.json();
        setTournaments(Array.isArray(data) ? data : data.tournaments || []);
      } catch (err) {
        setError(err.message || 'Failed to load tournaments');
      }
    };

    fetchTournaments();
  }, []);

  // Fetch standings when tournament is selected
  useEffect(() => {
    if (!selectedTournamentId) {
      setStandings([]);
      return;
    }

    const fetchStandings = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/standings?tournamentId=${selectedTournamentId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to load standings');
        }

        const data = await res.json();
        setStandings(Array.isArray(data.standings) ? data.standings : data || []);
      } catch (err) {
        setError(err.message || 'Error loading standings');
        console.error('Standings fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [selectedTournamentId]);

  const selectedTournament = tournaments.find(t => t.id === selectedTournamentId);

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">League Standings</h1>
          <p className="text-gray-600 mt-1">View current league tables for all seasons</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-80">
            <select
              value={selectedTournamentId}
              onChange={(e) => setSelectedTournamentId(e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
            >
              <option value="">Select Tournament / Season</option>
              {tournaments.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.season}) {t.isActive ? '• Active' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
          </div>

          <button
            onClick={() => setSelectedTournamentId(selectedTournamentId)} // refresh
            className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            title="Refresh"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      {!selectedTournamentId ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center text-gray-600">
          Select a tournament / season above to view its league standings
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-xl text-center">
          <AlertTriangle size={32} className="mx-auto mb-4" />
          {error}
        </div>
      ) : standings.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center text-gray-600">
          No standings available yet for {selectedTournament?.name || 'this tournament'}<br/>
          Matches need to be played first.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          {/* Tournament Info Header */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedTournament?.name} ({selectedTournament?.season})
                </h2>
                <p className="text-gray-600 mt-1">
                  {selectedTournament?.isActive ? 'Active Season' : 'Completed Season'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Updated just now</p>
              </div>
            </div>
          </div>

          {/* Standings Table */}
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
                {standings
                  .sort((a, b) => b.points - a.points || b.gd - a.gd)
                  .map((standing, index) => (
                    <tr key={standing.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {standing.position || index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                            style={{ backgroundColor: standing.team?.color || '#7C3AED' }}
                          >
                            {standing.team?.shortName?.[0] || standing.team?.name?.[0] || '?'}
                          </div>
                          <span className="font-medium text-gray-900">{standing.team?.name || 'Unknown Team'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">{standing.played || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">{standing.won || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">{standing.drawn || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">{standing.lost || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">{standing.gf || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">{standing.ga || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <span className={standing.gd >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {standing.gd >= 0 ? '+' : ''}{(standing.gd || 0)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900">
                        {standing.points || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex gap-1 justify-center">
                          {standing.form ? standing.form.split('').map((char, i) => (
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
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
