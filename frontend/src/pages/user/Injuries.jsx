import { useEffect, useState } from 'react';
import {
  AlertTriangle, Calendar, User, Stethoscope, Clock, CheckCircle, 
  Filter, Search, Loader2, TrendingUp, Activity, AlertCircle,
  Thermometer, HeartPulse, Bone, Brain, Bandage, Eye, ChevronDown, 
  ChevronUp, Mail, Phone, Shield, ClipboardCheck
} from 'lucide-react';

export default function Injuries() {
  const [injuries, setInjuries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedInjury, setExpandedInjury] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    recovered: 0,
    highSeverity: 0
  });

  // Get current user from localStorage or context
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user info
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setCurrentUser(userData);
    } catch (err) {
      console.error('Error parsing user data:', err);
    }
    
    fetchInjuries();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [injuries]);

  const fetchInjuries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/injuries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Failed to load injuries');
      
      const data = await res.json();
      // In a real app, backend should filter by current user
      const userInjuries = data.injuries || data || [];
      setInjuries(userInjuries);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = injuries.length;
    const active = injuries.filter(i => i.status === 'active').length;
    const recovered = injuries.filter(i => i.status === 'recovered').length;
    const highSeverity = injuries.filter(i => i.severity === 'high').length;

    setStats({ total, active, recovered, highSeverity });
  };

  const filteredInjuries = injuries.filter(injury => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && injury.status === 'active') ||
                         (filter === 'recovered' && injury.status === 'recovered') ||
                         (filter === 'high' && injury.severity === 'high');
    
    const matchesSearch = search === '' || 
                         injury.description?.toLowerCase().includes(search.toLowerCase()) ||
                         injury.injuryType?.toLowerCase().includes(search.toLowerCase()) ||
                         injury.bodyPart?.toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getInjuryIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'fracture':
        return <Bone className="h-5 w-5" />;
      case 'concussion':
        return <Brain className="h-5 w-5" />;
      case 'sprain':
      case 'strain':
        return <Activity className="h-5 w-5" />;
      case 'bruise':
      case 'contusion':
        return <Thermometer className="h-5 w-5" />;
      case 'cut':
      case 'laceration':
        return <Bandage className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 text-lg font-medium">Loading injury reports...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg border border-red-100">
        <div className="flex flex-col items-center text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Injuries</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchInjuries}
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
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Injury Reports</h1>
                <p className="text-gray-500 mt-2">
                  {currentUser?.fullName ? `Welcome, ${currentUser.fullName.split(' ')[0]}! ` : ''}
                  View your injury history and medical records
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-blue-700 font-medium">View Only Portal</span>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by injury type, body part, or description..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {[
                  { key: 'all', label: 'All Injuries', color: 'bg-gray-100 text-gray-800' },
                  { key: 'active', label: 'Active', color: 'bg-red-100 text-red-800' },
                  { key: 'recovered', label: 'Recovered', color: 'bg-green-100 text-green-800' },
                  { key: 'high', label: 'High Severity', color: 'bg-red-100 text-red-800' }
                ].map(({ key, label, color }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      filter === key 
                        ? color 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Injuries</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">All time records</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Injuries</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.active}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">Currently under treatment</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Recovered</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.recovered}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">Successfully treated</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">High Severity</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.highSeverity}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Activity className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">Serious injuries reported</div>
            </div>
          </div>
        </div>

        {/* Medical Information Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <ClipboardCheck className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-800">Medical Records Portal</h3>
              <p className="text-blue-700 mt-2">
                This portal displays your complete injury history as recorded by medical staff. 
                All information is read-only for your reference. If you notice any discrepancies 
                or have questions about your medical records, please contact the medical team.
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="font-medium text-blue-800">Last Updated</div>
                  <div className="text-sm text-blue-600 mt-1">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="font-medium text-blue-800">Medical Contact</div>
                  <div className="text-sm text-blue-600 mt-1">medicalsupport@team.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Injuries List */}
        <div className="space-y-4">
          {filteredInjuries.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
              <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Injury Records Found</h3>
              <p className="text-gray-500 mb-6">
                {search || filter !== 'all' 
                  ? 'No injuries match your search criteria.'
                  : 'No injury records are available in your medical history.'}
              </p>
              {!search && filter === 'all' && (
                <div className="text-sm text-gray-400">
                  Your medical records will appear here when available
                </div>
              )}
            </div>
          ) : (
            filteredInjuries.map((injury) => (
              <div
                key={injury._id || injury.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                {/* Injury Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${getSeverityColor(injury.severity)} bg-opacity-10`}>
                        <div className={getSeverityColor(injury.severity).replace('bg-', 'text-')}>
                          {getInjuryIcon(injury.injuryType)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {injury.injuryType || 'Injury Report'}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                injury.status === 'active'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {injury.status === 'active' ? 'Under Treatment' : 'Recovered'}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                injury.severity === 'high'
                                  ? 'bg-red-100 text-red-800'
                                  : injury.severity === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {injury.severity} severity
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {currentUser?.fullName || 'Medical Record'}
                              </span>
                              {currentUser?.position && (
                                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                  {currentUser.position}
                                </span>
                              )}
                              {currentUser?.jerseyNumber && (
                                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                  #{currentUser.jerseyNumber}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Reported On</div>
                            <div className="text-gray-900 font-medium">
                              {new Date(injury.dateReported || injury.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">{injury.description}</p>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Stethoscope className="h-4 w-4" />
                            {injury.injuryType || 'Injury Type'}
                          </div>
                          <div className="flex items-center gap-1">
                            <HeartPulse className="h-4 w-4" />
                            {injury.bodyPart || 'Body Part'}
                          </div>
                          {injury.expectedRecovery && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Expected: {new Date(injury.expectedRecovery).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setExpandedInjury(expandedInjury === (injury._id || injury.id) ? null : (injury._id || injury.id))}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-4"
                      aria-label={expandedInjury === (injury._id || injury.id) ? "Collapse details" : "Expand details"}
                    >
                      {expandedInjury === (injury._id || injury.id) ? 
                        <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      }
                    </button>
                  </div>
                </div>

                {/* Expanded Details - View Only */}
                {expandedInjury === (injury._id || injury.id) && (
                  <div className="px-6 pb-6 border-t border-gray-200 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <Stethoscope className="h-4 w-4" />
                          Treatment Plan
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-600">
                            {injury.treatment || 
                              'No specific treatment plan has been assigned yet. Please check with medical staff.'}
                          </p>
                          {!injury.treatment && (
                            <div className="mt-3 text-sm text-gray-500 flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              Medical staff will update this section
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <ClipboardCheck className="h-4 w-4" />
                          Medical Notes
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-600">
                            {injury.notes || 'No additional notes provided by medical staff.'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Injury Timeline
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Reported:</span>
                            <span className="text-gray-900 font-medium">
                              {new Date(injury.dateReported || injury.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          {injury.expectedRecovery && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Expected Recovery:</span>
                              <span className="text-blue-600 font-medium">
                                {new Date(injury.expectedRecovery).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          )}
                          {injury.dateRecovered && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Recovered On:</span>
                              <span className="text-green-600 font-medium">
                                {new Date(injury.dateRecovered).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Recovery Status
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Current Status:</span>
                            <span className={`font-medium ${
                              injury.status === 'active' ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {injury.status === 'active' ? 'Under Treatment' : 'Recovered'}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Days Since Injury:</span>
                            <span className="text-gray-900 font-medium">
                              {Math.floor((new Date() - new Date(injury.dateReported || injury.createdAt)) / (1000 * 60 * 60 * 24))} days
                            </span>
                          </div>
                          {injury.expectedRecovery && injury.status === 'active' && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Recovery Progress:</span>
                              <span className="text-blue-600 font-medium">
                                {Math.min(100, Math.floor(
                                  ((new Date() - new Date(injury.dateReported || injury.createdAt)) / 
                                  (new Date(injury.expectedRecovery) - new Date(injury.dateReported || injury.createdAt))) * 100
                                ))}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Medical Contact Info */}
                    {injury.status === 'active' && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                            <div>
                              <h5 className="font-medium text-blue-800">Medical Follow-up Required</h5>
                              <p className="text-blue-600 text-sm mt-1">
                                This injury is currently under treatment. Please follow up with medical staff 
                                for updates on your recovery progress and any necessary adjustments to your 
                                treatment plan.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact Information */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Medical Support</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                For questions about your medical records or to request updates, please contact our medical team
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-800 mb-2">Email Medical Team</h4>
                <p className="text-gray-600 text-sm">medicalsupport@team.com</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <Phone className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-800 mb-2">Emergency Contact</h4>
                <p className="text-gray-600 text-sm">+1 (555) MED-HELP</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-800 mb-2">Urgent Care</h4>
                <p className="text-gray-600 text-sm">Available 24/7</p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Last medical records update: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}