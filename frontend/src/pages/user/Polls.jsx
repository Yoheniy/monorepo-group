import { useEffect, useState } from 'react';
import {
  BarChart3, Clock, CheckCircle, XCircle, TrendingUp, Users, 
  Calendar, Vote, Filter, Loader2, AlertCircle, ChevronRight,
  Shield, Eye, MessageSquare, Award, Target, PieChart, BarChart,
  Lock, Globe, Clock3, CalendarDays, UserCheck, Timer
} from 'lucide-react';

export default function Polls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('active');
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [voting, setVoting] = useState({});
  const [results, setResults] = useState({});

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/polls', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load polls');
      const data = await res.json();
      const pollsData = data.polls || data || [];
      setPolls(pollsData);
      
      // Initialize results for each poll
      const initialResults = {};
      pollsData.forEach(poll => {
        if (poll.options) {
          const totalVotes = poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);
          initialResults[poll._id || poll.id] = {
            totalVotes,
            options: poll.options.map(opt => ({
              ...opt,
              percentage: totalVotes > 0 ? Math.round((opt.votes || 0) / totalVotes * 100) : 0
            }))
          };
        }
      });
      setResults(initialResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, optionId) => {
    if (voting[pollId]) return; // Prevent double voting
    
    setVoting(prev => ({ ...prev, [pollId]: true }));
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ optionId })
      });
      
      if (!res.ok) throw new Error('Failed to submit vote');
      
      const updatedPoll = await res.json();
      
      // Update the poll in the list
      setPolls(prev => prev.map(p => 
        (p._id || p.id) === pollId ? updatedPoll : p
      ));
      
      // Update results
      if (updatedPoll.options) {
        const totalVotes = updatedPoll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
        setResults(prev => ({
          ...prev,
          [pollId]: {
            totalVotes,
            options: updatedPoll.options.map(opt => ({
              ...opt,
              percentage: totalVotes > 0 ? Math.round((opt.votes || 0) / totalVotes * 100) : 0
            }))
          }
        }));
      }
      
      alert('Vote submitted successfully!');
    } catch (err) {
      alert(err.message);
    } finally {
      setVoting(prev => ({ ...prev, [pollId]: false }));
    }
  };

  const filteredPolls = polls.filter(poll => {
    const now = new Date();
    const endDate = new Date(poll.endsAt);
    const isActive = endDate > now;
    
    if (filter === 'active') return isActive;
    if (filter === 'ended') return !isActive;
    return true;
  });

  const getPollStatus = (poll) => {
    const now = new Date();
    const endDate = new Date(poll.endsAt);
    if (endDate > now) {
      const diffMs = endDate - now;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (diffDays > 0) return { status: 'active', text: `Ends in ${diffDays} day${diffDays > 1 ? 's' : ''}` };
      if (diffHours > 0) return { status: 'active', text: `Ends in ${diffHours} hour${diffHours > 1 ? 's' : ''}` };
      return { status: 'active', text: 'Ends soon' };
    }
    return { status: 'ended', text: 'Ended' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 text-lg font-medium">Loading polls...</p>
        <p className="text-gray-400 text-sm mt-2">Fetching the latest voting activities</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg border border-red-100">
        <div className="flex flex-col items-center text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Polls</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchPolls}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Polls & Surveys</h1>
              <p className="text-gray-500 mt-2">Participate in team decisions and share your opinions</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{polls.length}</div>
                <div className="text-sm text-gray-500">Total Polls</div>
              </div>
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Vote className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Polls</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {polls.filter(p => new Date(p.endsAt) > new Date()).length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Votes</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {Object.values(results).reduce((sum, r) => sum + (r?.totalVotes || 0), 0)}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg. Participation</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {polls.length > 0 ? Math.round(Object.values(results).reduce((sum, r) => sum + (r?.totalVotes || 0), 0) / polls.length) : 0}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Ended Polls</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {polls.filter(p => new Date(p.endsAt) <= new Date()).length}
                  </p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'active', label: 'Active Polls', icon: Clock, color: 'bg-green-100 text-green-800' },
                { key: 'ended', label: 'Ended Polls', icon: CheckCircle, color: 'bg-blue-100 text-blue-800' },
                { key: 'all', label: 'All Polls', icon: BarChart3, color: 'bg-gray-100 text-gray-800' }
              ].map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === key 
                      ? color 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Polls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPolls.length === 0 ? (
            <div className="lg:col-span-2 bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
              <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {filter === 'active' ? 'No Active Polls' : 
                 filter === 'ended' ? 'No Ended Polls' : 'No Polls Available'}
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === 'active' 
                  ? 'There are currently no active polls. Check back soon for new voting opportunities.' 
                  : 'No polls match your current filter.'}
              </p>
            </div>
          ) : (
            filteredPolls.map((poll) => {
              const pollId = poll._id || poll.id;
              const pollResults = results[pollId];
              const status = getPollStatus(poll);
              const hasVoted = poll.voted || poll.userVoted;
              const isActive = status.status === 'active';
              const totalVotes = pollResults?.totalVotes || 0;

              return (
                <div
                  key={pollId}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Poll Header */}
                  <div className={`p-6 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100' 
                      : 'bg-gradient-to-r from-gray-50 to-gray-100'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{poll.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {status.text}
                          </span>
                        </div>
                        {poll.description && (
                          <p className="text-gray-600 mb-4">{poll.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Ends: {formatDate(poll.endsAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {totalVotes} votes
                          </div>
                          {poll.privacy && (
                            <div className="flex items-center gap-1">
                              {poll.privacy === 'private' ? (
                                <>
                                  <Lock className="h-4 w-4" />
                                  Private
                                </>
                              ) : (
                                <>
                                  <Globe className="h-4 w-4" />
                                  Public
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Poll Content */}
                  <div className="p-6">
                        {/* Voting Options or Results */}
                        <div className="space-y-4 mb-6">
                          {isActive && !hasVoted ? (
                            <>
                              <h4 className="font-medium text-gray-700 mb-3">Cast Your Vote:</h4>
                              <div className="space-y-3">
                                {poll.options?.map((option, index) => (
                                  <button
                                    key={option._id || option.id || index}
                                    onClick={() => handleVote(pollId, option._id || option.id)}
                                    disabled={voting[pollId]}
                                    className="w-full text-left p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 flex items-center justify-between group"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-medium">
                                        {String.fromCharCode(65 + index)}
                                      </div>
                                      <span className="font-medium text-gray-900">{option.text}</span>
                                    </div>
                                    {voting[pollId] ? (
                                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                    ) : (
                                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-medium text-gray-700">Results:</h4>
                                <div className="text-sm text-gray-500">
                                  <span className="font-medium text-blue-600">{totalVotes}</span> total votes
                                </div>
                              </div>
                              <div className="space-y-4">
                                {pollResults?.options?.map((option, index) => (
                                  <div key={option._id || option.id || index} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 bg-gray-100 rounded flex items-center justify-center font-medium text-xs">
                                          {String.fromCharCode(65 + index)}
                                        </div>
                                        <span className="font-medium text-gray-900">{option.text}</span>
                                        {option.votes > 0 && hasVoted && option.userSelected && (
                                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                            Your vote
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-gray-700">
                                        <span className="font-medium">{option.percentage}%</span>
                                        <span className="text-gray-500 ml-2">({option.votes || 0} votes)</span>
                                      </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000"
                                        style={{ width: `${option.percentage}%` }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                          {isActive && hasVoted && (
                            <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <div>
                                  <div className="font-medium text-green-800">Vote Submitted!</div>
                                  <div className="text-sm text-green-600">
                                    Thank you for participating. Results will be available after the poll ends.
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {!isActive && (
                            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md">
                              <Eye className="h-5 w-5" />
                              View Detailed Results
                            </button>
                          )}
                          <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                            <MessageSquare className="h-5 w-5" />
                            Comments ({poll.comments?.length || 0})
                          </button>
                        </div>
                      </div>
                </div>
              );
            })
          )}
        </div>

        {/* Voting Guide */}
        <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Voice Matters</h3>
              <p className="text-gray-600 mb-4">
                Participate in polls to help shape team decisions. Your votes contribute to important discussions 
                and help create a better experience for everyone. Each poll typically remains open for 3-7 days.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <div className="font-medium text-gray-700">Voting Privacy</div>
                  </div>
                  <p className="text-sm text-gray-600">Your individual votes are anonymous to other members</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="h-4 w-4 text-blue-600" />
                    <div className="font-medium text-gray-700">Time Limit</div>
                  </div>
                  <p className="text-sm text-gray-600">Each poll has a specific end date and time</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    <div className="font-medium text-gray-700">One Vote Per Person</div>
                  </div>
                  <p className="text-sm text-gray-600">Each member can vote once per poll</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Polls Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <CalendarDays className="h-6 w-6 text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">Voting Schedule</h4>
            </div>
            <p className="text-gray-600 mb-4">
              New polls are typically launched every Monday morning. Results are announced within 24 hours of the poll closing.
            </p>
            <div className="text-sm text-gray-500">
              Next poll cycle starts: {new Date(Date.now() + 86400000).toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-6 w-6 text-purple-600" />
              <h4 className="text-lg font-semibold text-gray-900">Recent Winners</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-gray-700">Team Jersey Design</div>
                <div className="font-medium text-purple-600">Option C (65%)</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-gray-700">Practice Schedule</div>
                <div className="font-medium text-purple-600">Option A (72%)</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-gray-700">Team Dinner Venue</div>
                <div className="font-medium text-purple-600">Option B (58%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}