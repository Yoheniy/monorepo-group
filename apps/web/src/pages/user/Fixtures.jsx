import { useEffect, useState, useMemo } from 'react';
import { Search, Filter, Calendar, Star, Bell, ChevronDown, ChevronUp, Download, Share2, Eye, EyeOff, BarChart3, Zap, Target, Sparkles, Trophy, Users } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export default function Fixtures() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatchweek, setSelectedMatchweek] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [favorites, setFavorites] = useState(new Set());
  const [expandedDate, setExpandedDate] = useState(null);
  const [notifications, setNotifications] = useState({});
  const [viewMode, setViewMode] = useState('detailed');
  const [showStats, setShowStats] = useState(false);
  const [matchweeks, setMatchweeks] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/matches`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        if (!res.ok) throw new Error('Failed to load fixtures');
        const data = await res.json();
        
        // Set matches from database
        const dbMatches = data.matches || data || [];
        setMatches(dbMatches);
        
        // Extract unique matchweeks from database
        const weeks = [...new Set(dbMatches.map(m => m.matchweek || m.week || m.round))]
          .filter(week => week !== null && week !== undefined)
          .sort((a, b) => a - b);
        setMatchweeks(weeks);
        
      } catch (err) { 
        setError(err.message); 
      } finally { 
        setLoading(false); 
      }
    };
    load();
  }, []);

  // Filter and sort matches based on database data only
  const filteredMatches = useMemo(() => {
    let result = matches.filter(match => {
      // Filter by status - only using data from database
      if (activeFilter === 'upcoming') return !match.homeScore && !match.awayScore;
      if (activeFilter === 'results') return match.homeScore != null && match.awayScore != null;
      if (activeFilter === 'live') return match.status === 'live';
      if (activeFilter === 'favorites') return favorites.has(match.id);
      return true;
    });

    // Filter by matchweek from database
    if (selectedMatchweek !== 'all') {
      const weekNumber = parseInt(selectedMatchweek);
      result = result.filter(match => 
        match.matchweek === weekNumber || 
        match.week === weekNumber || 
        match.round === weekNumber
      );
    }

    // Search filter using only database fields
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(match => 
        (match.homeTeam?.name?.toLowerCase().includes(query)) ||
        (match.awayTeam?.name?.toLowerCase().includes(query)) ||
        (match.venue?.toLowerCase().includes(query)) ||
        (match.referee?.toLowerCase().includes(query)) ||
        (match.competition?.toLowerCase().includes(query))
      );
    }

    // Sort using database fields only
    result.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (sortBy === 'matchweek') {
        const weekA = a.matchweek || a.week || a.round || 0;
        const weekB = b.matchweek || b.week || b.round || 0;
        return sortOrder === 'asc' ? weekA - weekB : weekB - weekA;
      }
      if (sortBy === 'attendance') {
        const attendanceA = a.attendance || 0;
        const attendanceB = b.attendance || 0;
        return sortOrder === 'asc' ? attendanceA - attendanceB : attendanceB - attendanceA;
      }
      return 0;
    });

    return result;
  }, [matches, activeFilter, selectedMatchweek, searchQuery, sortBy, sortOrder, favorites]);

  // Group matches by date from database
  const groupedMatches = useMemo(() => {
    return filteredMatches.reduce((groups, match) => {
      const dateKey = match.date ? new Date(match.date).toDateString() : 'Date TBA';
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: match.date || null,
          dateKey: dateKey,
          matches: [],
          totalMatches: 0,
          upcoming: 0,
          completed: 0
        };
      }
      groups[dateKey].matches.push(match);
      groups[dateKey].totalMatches++;
      if (match.homeScore != null && match.awayScore != null) {
        groups[dateKey].completed++;
      } else {
        groups[dateKey].upcoming++;
      }
      return groups;
    }, {});
  }, [filteredMatches]);

  // Calculate statistics from database data only
  const calculateMatchStats = useMemo(() => {
    const completed = filteredMatches.filter(m => m.homeScore != null && m.awayScore != null);
    const totalGoals = completed.reduce((sum, m) => sum + (parseInt(m.homeScore) || 0) + (parseInt(m.awayScore) || 0), 0);
    const avgGoals = completed.length > 0 ? (totalGoals / completed.length).toFixed(2) : 0;
    const homeWins = completed.filter(m => (parseInt(m.homeScore) || 0) > (parseInt(m.awayScore) || 0)).length;
    const awayWins = completed.filter(m => (parseInt(m.awayScore) || 0) > (parseInt(m.homeScore) || 0)).length;
    const draws = completed.filter(m => (parseInt(m.homeScore) || 0) === (parseInt(m.awayScore) || 0)).length;
    
    return {
      totalMatches: filteredMatches.length,
      completed: completed.length,
      upcoming: filteredMatches.filter(m => !m.homeScore && !m.awayScore).length,
      avgGoals,
      homeWins,
      awayWins,
      draws,
      totalGoals,
      totalAttendance: completed.reduce((sum, m) => sum + (parseInt(m.attendance) || 0), 0)
    };
  }, [filteredMatches]);

  const stats = calculateMatchStats;

  // Helper functions
  const toggleFavorite = (matchId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      newFavorites.has(matchId) ? newFavorites.delete(matchId) : newFavorites.add(matchId);
      return newFavorites;
    });
  };

  const toggleNotification = (matchId) => {
    setNotifications(prev => ({
      ...prev,
      [matchId]: !prev[matchId]
    }));
  };

  const exportFixtures = () => {
    const headers = ['Date', 'Time', 'Home Team', 'Home Score', 'Away Score', 'Away Team', 'Venue', 'Matchweek', 'Status', 'Competition'];
    const csvData = filteredMatches.map(match => {
      const date = match.date ? new Date(match.date) : new Date();
      const week = match.matchweek || match.week || match.round || 'N/A';
      const status = match.homeScore != null ? 'Completed' : (match.status || 'Upcoming');
      
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        match.homeTeam?.name || 'TBD',
        match.homeScore || '',
        match.awayScore || '',
        match.awayTeam?.name || 'TBD',
        match.venue || 'TBD',
        week,
        status,
        match.competition || 'Premier League'
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fixtures-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const shareFixtures = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Premier League Fixtures',
        text: `Check out ${filteredMatches.length} Premier League matches.`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 border-4 border-transparent border-t-cyan-400 border-r-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-12 h-12 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <p className="mt-6 text-xl font-light text-gray-300 tracking-wider">
          LOADING <span className="text-cyan-400">FIXTURES</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">Fetching data from database...</p>
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
                  PREMIER LEAGUE
                </h1>
              </div>
              <p className="text-gray-400 font-light tracking-wide">FIXTURES & RESULTS DATABASE</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-2">
                <div className="text-sm text-gray-400">Data Source</div>
                <div className="font-medium text-cyan-400">Live Database</div>
              </div>
              <div className="text-sm text-gray-400">
                Updated: <span className="text-white">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Control Panel - Futuristic Design */}
        <div className="mb-8 bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search and Filters */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search with futuristic glow */}
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-cyan-400" />
                  <input
                    type="text"
                    placeholder="Search database fixtures..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity rounded-xl"></div>
                </div>

                {/* Matchweek Selector */}
                <div className="relative group">
                  <select
                    className="appearance-none w-full md:w-auto px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-10"
                    value={selectedMatchweek}
                    onChange={(e) => setSelectedMatchweek(e.target.value)}
                  >
                    <option value="all">All Matchweeks</option>
                    {matchweeks.map(week => (
                      <option key={week} value={week}>Matchweek {week}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All Matches', count: matches.length },
                  { id: 'upcoming', label: 'Upcoming', count: matches.filter(m => !m.homeScore && !m.awayScore).length },
                  { id: 'results', label: 'Results', count: matches.filter(m => m.homeScore != null && m.awayScore != null).length },
                  { id: 'live', label: 'Live', count: matches.filter(m => m.status === 'live').length },
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeFilter === filter.id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    {filter.label}
                    <span className="ml-2 bg-white/10 px-2 py-0.5 rounded-full text-xs">
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode(viewMode === 'detailed' ? 'compact' : 'detailed')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700/50 transition-all duration-300 group"
              >
                {viewMode === 'detailed' ? <EyeOff size={18} /> : <Eye size={18} />}
                <span className="hidden md:inline">{viewMode === 'detailed' ? 'Compact' : 'Detailed'}</span>
              </button>
              <button
                onClick={exportFixtures}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/20 group"
              >
                <Download size={18} />
                <span className="hidden md:inline">Export</span>
              </button>
              <button
                onClick={shareFixtures}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/20 group"
              >
                <Share2 size={18} />
                <span className="hidden md:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Sort by:</span>
              <div className="flex gap-2">
                {[
                  { id: 'date', label: 'Date', icon: Calendar },
                  { id: 'matchweek', label: 'Matchweek', icon: Target },
                  { id: 'attendance', label: 'Attendance', icon: Users }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      if (sortBy === id) {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy(id);
                        setSortOrder('asc');
                      }
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                      sortBy === id
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
                    }`}
                  >
                    {Icon && <Icon size={14} />}
                    {label}
                    {sortBy === id && (
                      sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
            <div className="text-3xl font-bold text-cyan-400">{stats.totalMatches}</div>
            <div className="text-gray-400 text-sm mt-1">Total Matches</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400">{stats.upcoming}</div>
            <div className="text-gray-400 text-sm mt-1">Upcoming</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
            <div className="text-3xl font-bold text-purple-400">{stats.completed}</div>
            <div className="text-gray-400 text-sm mt-1">Completed</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-600/10 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6">
            <div className="text-3xl font-bold text-yellow-400">{stats.totalGoals}</div>
            <div className="text-gray-400 text-sm mt-1">Total Goals</div>
          </div>
        </div>

        {/* Fixtures List */}
        {filteredMatches.length === 0 ? (
          <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-12 text-center">
            <div className="text-gray-500 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">No matches found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria</p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
                setSelectedMatchweek('all');
              }}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-cyan-500/20"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.values(groupedMatches).map((group) => {
              const groupDate = group.date ? new Date(group.date) : null;
              
              return (
                <div key={group.dateKey} className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden group">
                  {/* Date Header */}
                  <div 
                    className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 px-6 py-4 border-b border-gray-700/50 cursor-pointer hover:bg-gray-800/70 transition-all duration-300"
                    onClick={() => setExpandedDate(expandedDate === group.dateKey ? null : group.dateKey)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-lg">
                          <Calendar className="text-cyan-400" size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-white">
                            {groupDate ? groupDate.toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            }) : 'Date TBA'}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                            <span>{group.totalMatches} matches</span>
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              {group.upcoming} upcoming
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              {group.completed} completed
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {expandedDate === group.dateKey ? (
                          <ChevronUp className="text-cyan-400" />
                        ) : (
                          <ChevronDown className="text-cyan-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Matches List */}
                  {expandedDate === group.dateKey && (
                    <div className="divide-y divide-gray-700/50">
                      {group.matches.map(match => {
                        const matchDate = match.date ? new Date(match.date) : null;
                        const hasScore = match.homeScore != null && match.awayScore != null;
                        const isLive = match.status === 'live';
                        
                        return (
                          <div key={match.id} className="p-6 hover:bg-gray-800/20 transition-all duration-300 group/match">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              {/* Match Time */}
                              <div className="md:w-1/6">
                                <div className="text-lg font-medium text-cyan-400">
                                  {matchDate ? matchDate.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }) : 'TBA'}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    hasScore 
                                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-600/20 text-green-400 border border-green-500/30' 
                                      : isLive
                                      ? 'bg-gradient-to-r from-red-500/20 to-pink-600/20 text-red-400 border border-red-500/30 animate-pulse'
                                      : 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30'
                                  }`}>
                                    {hasScore ? 'FINISHED' : isLive ? 'LIVE' : 'UPCOMING'}
                                  </span>
                                </div>
                              </div>

                              {/* Teams and Score */}
                              <div className="md:w-2/3">
                                <div className="grid grid-cols-3 items-center gap-8">
                                  {/* Home Team */}
                                  <div className="text-right space-y-2">
                                    <div className="text-2xl font-bold text-white">
                                      {match.homeTeam?.name || 'TBD'}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      Home
                                    </div>
                                  </div>

                                  {/* Score */}
                                  <div className="text-center">
                                    {hasScore ? (
                                      <div className="flex items-center justify-center gap-4">
                                        <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                          {match.homeScore}
                                        </span>
                                        <span className="text-2xl text-gray-500">-</span>
                                        <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                          {match.awayScore}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="relative">
                                        <div className="text-3xl font-black bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                                          VS
                                        </div>
                                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur opacity-30"></div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Away Team */}
                                  <div className="text-left space-y-2">
                                    <div className="text-2xl font-bold text-white">
                                      {match.awayTeam?.name || 'TBD'}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      Away
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Match Details */}
                                <div className="text-center mt-6">
                                  <div className="inline-flex items-center gap-4 text-sm text-gray-400">
                                    {match.venue && (
                                      <span className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
                                        {match.venue}
                                      </span>
                                    )}
                                    {match.competition && (
                                      <span className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                                        {match.competition}
                                      </span>
                                    )}
                                    {match.referee && (
                                      <span className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                                        Ref: {match.referee}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="md:w-1/6 flex justify-end gap-2">
                                <button
                                  onClick={() => toggleFavorite(match.id)}
                                  className={`p-3 rounded-xl transition-all duration-300 ${
                                    favorites.has(match.id)
                                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-600/20 text-yellow-400 border border-yellow-500/30'
                                      : 'bg-gray-800/50 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 border border-gray-700/50'
                                  }`}
                                >
                                  <Star size={20} fill={favorites.has(match.id) ? "currentColor" : "none"} />
                                </button>
                                <button
                                  onClick={() => toggleNotification(match.id)}
                                  className={`p-3 rounded-xl transition-all duration-300 ${
                                    notifications[match.id]
                                      ? 'bg-gradient-to-r from-blue-500/20 to-indigo-600/20 text-blue-400 border border-blue-500/30'
                                      : 'bg-gray-800/50 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 border border-gray-700/50'
                                  }`}
                                >
                                  <Bell size={20} />
                                </button>
                              </div>
                            </div>

                            {/* Extended Details */}
                            {viewMode === 'detailed' && (
                              <div className="mt-6 pt-6 border-t border-gray-700/50">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                  {/* Database Fields Only */}
                                  <div className="space-y-3">
                                    <div className="text-gray-400">Match Information</div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Status:</span>
                                      <span className="font-medium capitalize">{match.status || 'scheduled'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Competition:</span>
                                      <span className="font-medium">{match.competition || 'Premier League'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Matchweek:</span>
                                      <span className="font-medium">{match.matchweek || match.week || match.round || 'N/A'}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <div className="text-gray-400">Venue Details</div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Venue:</span>
                                      <span className="font-medium">{match.venue || 'TBD'}</span>
                                    </div>
                                    {match.attendance && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Attendance:</span>
                                        <span className="font-medium text-cyan-400">{match.attendance.toLocaleString()}</span>
                                      </div>
                                    )}
                                    {match.referee && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Referee:</span>
                                        <span className="font-medium">{match.referee}</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <div className="text-gray-400">Database Info</div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Last Updated:</span>
                                      <span className="font-medium">{match.updatedAt ? new Date(match.updatedAt).toLocaleString() : 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Data Source:</span>
                                      <span className="font-medium text-green-400">Live Database</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              Showing <span className="text-white font-bold">{filteredMatches.length}</span> of <span className="text-white font-bold">{matches.length}</span> database records
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                <span>Connected to Database</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Favorites Panel - Futuristic */}
      {favorites.size > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 w-72 shadow-2xl shadow-cyan-500/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="text-yellow-400" size={18} />
                <h4 className="font-bold text-white">Favorite Matches</h4>
              </div>
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {favorites.size}
              </span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {matches
                .filter(m => favorites.has(m.id))
                .map(match => (
                  <div key={match.id} className="text-sm p-3 bg-gray-900/50 rounded-xl border border-gray-700/30 hover:border-cyan-500/30 transition-colors">
                    <div className="font-medium text-white truncate">
                      {match.homeTeam?.name || 'Home'} vs {match.awayTeam?.name || 'Away'}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      {match.date ? new Date(match.date).toLocaleDateString() : 'Date TBA'}
                      {match.competition && ` • ${match.competition}`}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
