// src/pages/admin/PollsAndVotes.jsx
import { useEffect, useState } from 'react';
import { 
  BarChart3, Plus, Vote, Edit, Trash2, Users, Trophy, AlertTriangle, 
  Save, X, Search, Filter, CheckCircle, Clock 
} from 'lucide-react';

export default function PollsAndVotes() {
  const [activeTab, setActiveTab] = useState('polls');
  const [polls, setPolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [pollOptions, setPollOptions] = useState([]);
  const [votes, setVotes] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreatePollModal, setShowCreatePollModal] = useState(false);

  const [pollForm, setPollForm] = useState({
    tournamentId: '',
    question: '',
    type: 'PLAYER',
    matchId: '',
    startsAt: '',
    endsAt: '',
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        // Tournaments
        const tourRes = await fetch('http://localhost:5000/api/tournaments', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!tourRes.ok) throw new Error('Failed to load tournaments');
        const tourData = await tourRes.json();
        setTournaments(Array.isArray(tourData) ? tourData : []);

        // Polls
        const pollRes = await fetch('http://localhost:5000/api/polls', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!pollRes.ok) throw new Error('Failed to load polls');
        const pollData = await pollRes.json();
        setPolls(Array.isArray(pollData) ? pollData : pollData.polls || []);

      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch options & votes when poll selected
  useEffect(() => {
    if (!selectedPoll?.id) return;

    const fetchPollData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Poll Options
        const optRes = await fetch(`http://localhost:5000/api/poll-options/${selectedPoll.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!optRes.ok) throw new Error('Failed to load poll options');
        const optData = await optRes.json();
        setPollOptions(Array.isArray(optData) ? optData : optData.options || []);

        // Votes
        const voteRes = await fetch(`http://localhost:5000/api/votes/${selectedPoll.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!voteRes.ok) throw new Error('Failed to load votes');
        const voteData = await voteRes.json();
        setVotes(Array.isArray(voteData) ? voteData : voteData.votes || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPollData();
  }, [selectedPoll]);

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...pollForm,
          startsAt: new Date(pollForm.startsAt).toISOString(),
          endsAt: new Date(pollForm.endsAt).toISOString(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create poll');
      }

      const newPoll = await res.json();
      setPolls(prev => [...prev, newPoll.poll || newPoll]);
      setShowCreatePollModal(false);
      setPollForm({
        tournamentId: '',
        question: '',
        type: 'PLAYER',
        matchId: '',
        startsAt: '',
        endsAt: '',
      });

      alert('Poll created successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header + Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Voting & Polls</h1>
          <p className="text-gray-600 mt-1">Create polls, manage options and view votes</p>
        </div>

        <div className="flex gap-3 bg-white p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setActiveTab('polls')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'polls' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Polls & Voting
          </button>
          <button
            onClick={() => setActiveTab('votes')}
            disabled={!selectedPoll}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'votes' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100 disabled:opacity-50'
            }`}
          >
            View Votes
          </button>
        </div>
      </div>

      {/* Polls Tab */}
      {activeTab === 'polls' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">All Polls</h2>
            <button
              onClick={() => setShowCreatePollModal(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium shadow-md"
            >
              <Plus size={20} />
              Create New Poll
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
          ) : polls.length === 0 ? (
            <div className="text-center text-gray-500 p-12 bg-white rounded-xl shadow">
              No polls created yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {polls.map(p => (
                <div 
                  key={p.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    setSelectedPoll(p);
                    setActiveTab('votes');
                  }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{p.question}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {p.type} • {p.tournament?.name || 'General'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        new Date(p.endsAt) > new Date() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {new Date(p.endsAt) > new Date() ? 'Active' : 'Ended'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">Starts</p>
                        <p>{new Date(p.startsAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-medium">Ends</p>
                        <p>{new Date(p.endsAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 rounded-lg transition">
                        View Votes
                      </button>
                      <button className="p-2 text-gray-600 hover:text-indigo-700 rounded hover:bg-indigo-50 transition">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:text-red-800 rounded hover:bg-red-50 transition">
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

      {/* Votes Tab */}
      {activeTab === 'votes' && (
        <div>
          {!selectedPoll ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center text-gray-600">
              Select a poll from the "Polls & Voting" tab to view votes
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Votes for: {selectedPoll.question}
                </h2>
                <div className="text-sm text-gray-600">
                  {new Date(selectedPoll.startsAt).toLocaleDateString()} - {new Date(selectedPoll.endsAt).toLocaleDateString()}
                </div>
              </div>

              {/* Poll Info */}
              <div className="bg-white rounded-xl shadow border p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium text-gray-900">{selectedPoll.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tournament</p>
                    <p className="font-medium text-gray-900">{selectedPoll.tournament?.name || 'General'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      new Date(selectedPoll.endsAt) > new Date() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {new Date(selectedPoll.endsAt) > new Date() ? 'Active' : 'Ended'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Options & Vote Counts */}
              <div className="bg-white rounded-xl shadow border overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-bold text-gray-800">Poll Options & Votes</h3>
                </div>

                {pollOptions.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    No options added yet
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {pollOptions.map(option => {
                      const voteCount = votes.filter(v => v.optionId === option.id).length;
                      return (
                        <div key={option.id} className="p-6 hover:bg-gray-50 transition">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              {option.playerId && (
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                  <Users size={20} className="text-gray-600" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-900">{option.title}</p>
                                {option.playerId && (
                                  <p className="text-sm text-gray-600">Player ID: {option.playerId}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-indigo-600">{voteCount}</p>
                              <p className="text-sm text-gray-500">votes</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Votes */}
              <div className="bg-white rounded-xl shadow border overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-bold text-gray-800">Recent Votes ({votes.length})</h3>
                </div>

                {votes.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    No votes yet
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {votes.slice(0, 10).map(vote => (
                      <div key={vote.id} className="p-6 hover:bg-gray-50 transition">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">
                              {vote.user?.fullName || 'Anonymous'} voted for
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {pollOptions.find(o => o.id === vote.optionId)?.title || 'Unknown option'}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(vote.votedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {votes.length > 10 && (
                      <div className="p-4 text-center text-gray-500">
                        Showing 10 of {votes.length} votes
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Poll Modal */}
      {showCreatePollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">Create New Poll</h2>
              <button onClick={() => setShowCreatePollModal(false)}>
                <X size={28} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleCreatePoll} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tournament *</label>
                <select
                  value={pollForm.tournamentId}
                  onChange={e => setPollForm({...pollForm, tournamentId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                <input
                  type="text"
                  value={pollForm.question}
                  onChange={e => setPollForm({...pollForm, question: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Who is the best player of the season?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poll Type *</label>
                <select
                  value={pollForm.type}
                  onChange={e => setPollForm({...pollForm, type: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="PLAYER">Player of the Match</option>
                  <option value="GOAL">Goal of the Week</option>
                  <option value="TEAM">Team of the Week</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Starts At *</label>
                  <input
                    type="datetime-local"
                    value={pollForm.startsAt}
                    onChange={e => setPollForm({...pollForm, startsAt: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ends At *</label>
                  <input
                    type="datetime-local"
                    value={pollForm.endsAt}
                    onChange={e => setPollForm({...pollForm, endsAt: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Related Match (optional)</label>
                <input
                  type="text"
                  value={pollForm.matchId}
                  onChange={e => setPollForm({...pollForm, matchId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Match ID (if applicable)"
                />
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreatePollModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm flex items-center gap-2"
                >
                  <Vote size={18} />
                  Create Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}