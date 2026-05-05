import { useEffect, useState } from 'react';
import { 
  Trophy, Calendar, Users, MapPin, Target, Zap, Star, TrendingUp, 
  BarChart3, Award, Crown, Shield, ChevronRight, Filter, Search,
  Clock, TrendingDown, Users2, Home, Share2, Download, Eye
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [standings, setStandings] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [topScorers, setTopScorers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const loadTournaments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/tournaments`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        const data = await res.json();
        const tournamentsList = data.tournaments || data || [];
        setTournaments(tournamentsList);
        
        if (tournamentsList.length > 0) {
          const firstTournament = tournamentsList[0];
          setSelectedTournament(firstTournament);
          await loadTournamentData(firstTournament.id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadTournaments();
  }, []);

  const loadTournamentData = async (tournamentId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Load standings
      const standingsRes = await fetch(`${API_BASE_URL}/standings?tournamentId=${tournamentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const standingsData = await standingsRes.json();
      const sortedStandings = (standingsData.standings || standingsData || [])
        .sort((a, b) => (b.points || 0) - (a.points || 0))
        .map((team, index) => ({
          ...team,
          position: index + 1,
          form: ['W', 'D', 'L', 'W', 'W'].slice(0, 5), // Mock form data
          goalDifference: (team.goalsFor || 0) - (team.goalsAgainst || 0)
        }));
      setStandings(sortedStandings);

      // Load fixtures
      const fixturesRes = await fetch(`${API_BASE_URL}/matches?tournamentId=${tournamentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fixturesData = await fixturesRes.json();
      setFixtures(fixturesData.matches || fixturesData || []);

      // Load top scorers (mock data for now - would come from API)
      const mockScorers = [
        { id: 1, name: 'Erling Haaland', team: 'Manchester City', goals: 25, assists: 5 },
        { id: 2, name: 'Harry Kane', team: 'Bayern Munich', goals: 23, assists: 8 },
        { id: 3, name: 'Kylian Mbappé', team: 'Paris Saint-Germain', goals: 21, assists: 7 },
        { id: 4, name: 'Mohamed Salah', team: 'Liverpool', goals: 19, assists: 10 },
        { id: 5, name: 'Lionel Messi', team: 'Inter Miami', goals: 18, assists: 12 },
      ];
      setTopScorers(mockScorers);

      // Calculate tournament stats
      const tournamentStats = {
        totalTeams: sortedStandings.length,
        totalMatches: (fixturesData.matches || fixturesData || []).length,
        completedMatches: (fixturesData.matches || fixturesData || []).filter(m => m.homeScore != null && m.awayScore != null).length,
        totalGoals: sortedStandings.reduce((sum, team) => sum + (team.goalsFor || 0), 0),
        avgGoalsPerGame: sortedStandings.length > 0 ? 
          (sortedStandings.reduce((sum, team) => sum + (team.goalsFor || 0), 0) / 
          (sortedStandings.reduce((sum, team) => sum + (team.played || 0), 0) / 2)).toFixed(2) : 0,
        topTeam: sortedStandings[0]?.team?.name || 'N/A',
        topScorer: mockScorers[0]?.name || 'N/A'
      };
      setStats(tournamentStats);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTournamentSelect = async (tournament) => {
    setSelectedTournament(tournament);
    setActiveTab('overview');
    await loadTournamentData(tournament.id);
  };

  const getPositionColor = (position) => {
    if (position === 1) return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
    if (position <= 4) return 'from-green-500/20 to-emerald-600/20 border-green-500/30';
    if (position <= 6) return 'from-blue-500/20 to-cyan-600/20 border-blue-500/30';
    if (position >= 18) return 'from-red-500/20 to-pink-600/20 border-red-500/30';
    return 'from-gray-500/20 to-gray-600/20 border-gray-700/30';
  };

  const getFormColor = (result) => {
    switch(result) {
      case 'W': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'D': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'L': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-700/30';
    }
  };

  if (loading && !selectedTournament) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 border-4 border-transparent border-t-cyan-400 border-r-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Trophy className="w-12 h-12 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <p className="mt-6 text-xl font-light text-gray-300 tracking-wider">
          LOADING <span className="text-cyan-400">TOURNAMENTS</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">Fetching tournament data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 flex items-center justify-center">
      <div className="bg-gray-800/50 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 max-w-md text-center shadow-2xl shadow-red-500/10">
        <div className="text-red-400 mb-4">
          <Zap className="w-16 h-16 mx-auto animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Connection Error</h2>
        <p className="text-gray-300 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-full font-medium text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Futuristic Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                  <Trophy className="w-6 h-6" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  TOURNAMENTS
                </h1>
              </div>
              <p className="text-gray-400 font-light tracking-wide">MANAGE & ANALYZE COMPETITIONS</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-2">
                <div className="text-sm text-gray-400">Active</div>
                <div className="font-medium text-green-400">{tournaments.length} tournaments</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Tournament List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">All Tournaments</h2>
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {tournaments.length}
                </span>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {tournaments.map((tournament) => (
                  <div
                    key={tournament.id}
                    onClick={() => handleTournamentSelect(tournament)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 group ${
                      selectedTournament?.id === tournament.id
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30'
                        : 'bg-gray-900/30 border border-gray-700/30 hover:bg-gray-800/50 hover:border-cyan-500/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          selectedTournament?.id === tournament.id
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600'
                            : 'bg-gray-800 group-hover:bg-cyan-500/20'
                        }`}>
                          <Trophy className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{tournament.name}</h3>
                          <p className="text-sm text-gray-400">{tournament.season || '2023/24'}</p>
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1 ${
                        selectedTournament?.id === tournament.id ? 'text-cyan-400' : ''
                      }`} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Database Connection</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {selectedTournament ? (
              <div className="space-y-8">
                {/* Tournament Header */}
                <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl">
                          <Trophy className="w-8 h-8" />
                        </div>
                        <div>
                          <h1 className="text-3xl font-bold text-white">{selectedTournament.name}</h1>
                          <p className="text-gray-400">
                            Season: <span className="text-cyan-400">{selectedTournament.season || '2023/24'}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="flex items-center gap-3 text-gray-400">
                          <Calendar className="w-5 h-5" />
                          <span>Started: {selectedTournament.startDate ? new Date(selectedTournament.startDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400">
                          <Target className="w-5 h-5" />
                          <span>Status: <span className="text-green-400">Active</span></span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400">
                          <Users className="w-5 h-5" />
                          <span>Teams: <span className="text-cyan-400">{stats.totalTeams || 0}</span></span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400">
                          <MapPin className="w-5 h-5" />
                          <span>Region: {selectedTournament.region || 'International'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:bg-gray-700/50 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                      <button className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-cyan-400">{stats.totalMatches || 0}</div>
                        <div className="text-gray-400 text-sm mt-1">Total Matches</div>
                      </div>
                      <BarChart3 className="w-8 h-8 text-cyan-400" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-green-400">{stats.completedMatches || 0}</div>
                        <div className="text-gray-400 text-sm mt-1">Completed</div>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-400" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-purple-400">{stats.totalGoals || 0}</div>
                        <div className="text-gray-400 text-sm mt-1">Total Goals</div>
                      </div>
                      <Target className="w-8 h-8 text-purple-400" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-600/10 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-yellow-400">{stats.avgGoalsPerGame || 0}</div>
                        <div className="text-gray-400 text-sm mt-1">Avg Goals/Game</div>
                      </div>
                      <TrendingUp className="w-8 h-8 text-yellow-400" />
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-2">
                  <div className="flex space-x-2">
                    {['overview', 'standings', 'fixtures', 'stats'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                          activeTab === tab
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[500px]">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Current Standings */}
                      <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-white">Current Standings</h3>
                          <span className="text-sm text-gray-400">Top 5</span>
                        </div>
                        <div className="space-y-3">
                          {standings.slice(0, 5).map((team) => (
                            <div key={team.id} className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl border border-gray-700/30">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${getPositionColor(team.position)}`}>
                                  <span className="font-bold text-sm">{team.position}</span>
                                  {team.position === 1 && <Crown className="w-3 h-3 ml-1 text-yellow-400" />}
                                </div>
                                <div>
                                  <div className="font-medium text-white">{team.team?.name}</div>
                                  <div className="flex gap-1 text-xs">
                                    {team.form?.map((result, idx) => (
                                      <span key={idx} className={`w-4 h-4 rounded flex items-center justify-center ${getFormColor(result)}`}>
                                        {result}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="text-2xl font-bold text-cyan-400">{team.points || 0}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top Scorers */}
                      <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-white">Top Scorers</h3>
                          <span className="text-sm text-gray-400">Golden Boot</span>
                        </div>
                        <div className="space-y-4">
                          {topScorers.map((player, index) => (
                            <div key={player.id} className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl border border-gray-700/30">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-600/20 flex items-center justify-center">
                                  <span className="font-bold text-yellow-400">{index + 1}</span>
                                </div>
                                <div>
                                  <div className="font-medium text-white">{player.name}</div>
                                  <div className="text-sm text-gray-400">{player.team}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-white">{player.goals}</div>
                                <div className="text-sm text-gray-400">goals</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Matches */}
                      <div className="lg:col-span-2 bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-white">Recent Matches</h3>
                          <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                            View All →
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {fixtures.slice(0, 4).map((match) => (
                            <div key={match.id} className="p-4 bg-gray-900/30 rounded-xl border border-gray-700/30">
                              <div className="flex items-center justify-between mb-3">
                                <div className="text-sm text-gray-400">
                                  {match.date ? new Date(match.date).toLocaleDateString() : 'Date TBA'}
                                </div>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  match.homeScore != null 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-cyan-500/20 text-cyan-400'
                                }`}>
                                  {match.homeScore != null ? 'FT' : 'Upcoming'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-center flex-1">
                                  <div className="font-medium text-white">{match.homeTeam?.name || 'TBD'}</div>
                                  <div className="text-xs text-gray-400">Home</div>
                                </div>
                                <div className="text-center mx-4">
                                  {match.homeScore != null ? (
                                    <div className="text-2xl font-bold text-white">
                                      {match.homeScore} - {match.awayScore}
                                    </div>
                                  ) : (
                                    <div className="text-lg text-gray-500">VS</div>
                                  )}
                                </div>
                                <div className="text-center flex-1">
                                  <div className="font-medium text-white">{match.awayTeam?.name || 'TBD'}</div>
                                  <div className="text-xs text-gray-400">Away</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Standings Tab */}
                  {activeTab === 'standings' && (
                    <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
                      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 px-6 py-4 border-b border-gray-700/50">
                        <div className="grid grid-cols-12 gap-4 text-sm text-gray-400 font-medium">
                          <div className="col-span-1 text-center">#</div>
                          <div className="col-span-5">TEAM</div>
                          <div className="col-span-1 text-center">P</div>
                          <div className="col-span-1 text-center">W</div>
                          <div className="col-span-1 text-center">D</div>
                          <div className="col-span-1 text-center">L</div>
                          <div className="col-span-1 text-center">GD</div>
                          <div className="col-span-1 text-center">PTS</div>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-700/30">
                        {standings.map((team) => (
                          <div key={team.id} className="px-6 py-4 hover:bg-gray-800/20 transition-colors">
                            <div className="grid grid-cols-12 gap-4 items-center">
                              <div className="col-span-1 text-center">
                                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r ${getPositionColor(team.position)}`}>
                                  <span className="font-bold text-sm">{team.position}</span>
                                </div>
                              </div>
                              <div className="col-span-5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                                  <Shield className="w-4 h-4 text-cyan-400" />
                                </div>
                                <div>
                                  <div className="font-bold text-white">{team.team?.name || 'Unknown Team'}</div>
                                  <div className="text-xs text-gray-400 flex items-center gap-1">
                                    {team.form?.map((result, idx) => (
                                      <span key={idx} className={`w-4 h-4 rounded flex items-center justify-center text-xs ${getFormColor(result)}`}>
                                        {result}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-1 text-center text-white">{team.played || 0}</div>
                              <div className="col-span-1 text-center text-emerald-400">{team.wins || 0}</div>
                              <div className="col-span-1 text-center text-yellow-400">{team.draws || 0}</div>
                              <div className="col-span-1 text-center text-red-400">{team.losses || 0}</div>
                              <div className="col-span-1 text-center">
                                <span className={`font-semibold ${
                                  team.goalDifference > 0 ? 'text-emerald-400' : 
                                  team.goalDifference < 0 ? 'text-red-400' : 'text-gray-400'
                                }`}>
                                  {team.goalDifference > 0 ? '+' : ''}{team.goalDifference || 0}
                                </span>
                              </div>
                              <div className="col-span-1 text-center text-2xl font-bold text-white">{team.points || 0}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fixtures Tab */}
                  {activeTab === 'fixtures' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-sm">
                            All Matches
                          </button>
                          <button className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-sm hover:bg-gray-700/50">
                            Upcoming
                          </button>
                          <button className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-sm hover:bg-gray-700/50">
                            Results
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              placeholder="Search fixtures..."
                              className="pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            />
                          </div>
                          <select className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500">
                            <option>All Matchweeks</option>
                            <option>Matchweek 1</option>
                            <option>Matchweek 2</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
                        {fixtures.length === 0 ? (
                          <div className="p-12 text-center">
                            <div className="text-gray-500 mb-4">
                              <Calendar className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-300 mb-2">No fixtures scheduled</h3>
                            <p className="text-gray-500">Check back later for upcoming matches</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-700/50">
                            {fixtures.map((match) => (
                              <div key={match.id} className="p-6 hover:bg-gray-800/20 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div className="md:w-1/6">
                                    <div className="text-lg font-medium text-cyan-400">
                                      {match.date ? new Date(match.date).toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      }) : 'TBA'}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      {match.date ? new Date(match.date).toLocaleDateString() : 'Date TBA'}
                                    </div>
                                  </div>
                                  <div className="md:w-2/3">
                                    <div className="grid grid-cols-3 items-center gap-4">
                                      <div className="text-right">
                                        <div className="font-bold text-white text-lg">{match.homeTeam?.name || 'TBD'}</div>
                                      </div>
                                      <div className="text-center">
                                        {match.homeScore != null ? (
                                          <div className="flex items-center justify-center gap-4">
                                            <span className="text-3xl font-bold text-cyan-400">{match.homeScore}</span>
                                            <span className="text-xl text-gray-500">-</span>
                                            <span className="text-3xl font-bold text-purple-400">{match.awayScore}</span>
                                          </div>
                                        ) : (
                                          <div className="text-xl font-bold text-gray-500">VS</div>
                                        )}
                                      </div>
                                      <div className="text-left">
                                        <div className="font-bold text-white text-lg">{match.awayTeam?.name || 'TBD'}</div>
                                      </div>
                                    </div>
                                    <div className="text-center mt-4">
                                      <div className="text-sm text-gray-400">
                                        <span>{match.venue || 'Venue TBD'}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="md:w-1/6 text-right">
                                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                      match.homeScore != null 
                                        ? 'bg-green-500/20 text-green-400' 
                                        : 'bg-cyan-500/20 text-cyan-400'
                                    }`}>
                                      {match.homeScore != null ? 'COMPLETED' : 'UPCOMING'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stats Tab */}
                  {activeTab === 'stats' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6">Team Statistics</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                              <span>Most Wins</span>
                              <span>{standings[0]?.wins || 0} wins</span>
                            </div>
                            <div className="w-full bg-gray-700/30 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full"
                                style={{ width: `${(standings[0]?.wins || 0) / 20 * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                              <span>Best Attack</span>
                              <span>{Math.max(...standings.map(t => t.goalsFor || 0))} goals</span>
                            </div>
                            <div className="w-full bg-gray-700/30 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full"
                                style={{ width: '85%' }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                              <span>Best Defense</span>
                              <span>{Math.min(...standings.map(t => t.goalsAgainst || 0))} conceded</span>
                            </div>
                            <div className="w-full bg-gray-700/30 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                                style={{ width: '72%' }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6">Tournament Insights</h3>
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-green-600/20 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                              </div>
                              <div>
                                <div className="font-medium text-white">Home Win Rate</div>
                                <div className="text-sm text-gray-400">This season</div>
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-emerald-400">42%</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-lg">
                                <Target className="w-5 h-5 text-cyan-400" />
                              </div>
                              <div>
                                <div className="font-medium text-white">Avg Goals Per Game</div>
                                <div className="text-sm text-gray-400">League average</div>
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-cyan-400">{stats.avgGoalsPerGame || 0}</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-orange-600/20 rounded-lg">
                                <Award className="w-5 h-5 text-yellow-400" />
                              </div>
                              <div>
                                <div className="font-medium text-white">Current Champion</div>
                                <div className="text-sm text-gray-400">Defending title</div>
                              </div>
                            </div>
                            <div className="text-lg font-bold text-yellow-400">Manchester City</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-12 text-center">
                <div className="text-gray-500 mb-4">
                  <Trophy className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-300 mb-2">No tournament selected</h3>
                <p className="text-gray-500 mb-6">Select a tournament from the list to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              Data Source: <span className="text-white">Live Database</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Last Updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
