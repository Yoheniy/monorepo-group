// src/pages/admin/Injuries.jsx
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  User,
  Save,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  Eye,
  MoreVertical,
  CheckCircle,
  Loader2,
  Shield,
  Thermometer,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function Injuries() {
  const [injuries, setInjuries] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInjury, setEditingInjury] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortConfig, setSortConfig] = useState({ key: 'reportedAt', direction: 'desc' });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    participantId: "",
    matchId: "",
    injuryType: "",
    severity: "MILD",
    expectedRecovery: "",
    status: "Active",
    notes: "",
  });

  // Filter and sort injuries
  const filteredInjuries = injuries
    .filter(injury => {
      const playerName = injury.participant?.user?.fullName || injury.playerName || "";
      const injuryType = injury.injuryType || "";
      const searchMatch = searchTerm === "" || 
        playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        injuryType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const severityMatch = severityFilter === "ALL" || injury.severity === severityFilter;
      const statusMatch = statusFilter === "ALL" || injury.status === statusFilter;
      
      return searchMatch && severityMatch && statusMatch;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";
      
      if (sortConfig.key === 'reportedAt' || sortConfig.key === 'createdAt') {
        return sortConfig.direction === 'asc' 
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }
      
      if (sortConfig.key === 'severity') {
        const severityOrder = { CRITICAL: 4, SEVERE: 3, MODERATE: 2, MILD: 1 };
        return sortConfig.direction === 'asc'
          ? severityOrder[aValue] - severityOrder[bValue]
          : severityOrder[bValue] - severityOrder[aValue];
      }
      
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  // Pagination calculations
  const totalItems = filteredInjuries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredInjuries.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, severityFilter, statusFilter]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ChevronDown className="w-4 h-4 opacity-30" />;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4" /> 
      : <ChevronDown className="w-4 h-4" />;
  };

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPrevPage = () => goToPage(currentPage - 1);

  // Generate page numbers for display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);
      
      if (currentPage <= 3) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (startPage > 1) {
        pageNumbers.unshift('...');
        pageNumbers.unshift(1);
      }
      
      if (endPage < totalPages) {
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Fetch injuries function
  const fetchInjuries = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const injRes = await fetch("http://localhost:5000/api/injuries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!injRes.ok) {
        const errorText = await injRes.text();
        throw new Error(`Failed to load injuries: ${errorText}`);
      }
      
      const injData = await injRes.json();
      console.log("Fetched injuries:", injData);
      
      let injuriesArray = [];
      if (Array.isArray(injData)) {
        injuriesArray = injData;
      } else if (injData.injuries && Array.isArray(injData.injuries)) {
        injuriesArray = injData.injuries;
      } else if (injData.data && Array.isArray(injData.data)) {
        injuriesArray = injData.data;
      }
      
      setInjuries(injuriesArray);
    } catch (err) {
      setError(err.message || "Failed to load injuries");
    }
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        await fetchInjuries();

        // Participants
        const partRes = await fetch("http://localhost:5000/api/participants", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!partRes.ok) throw new Error("Failed to load participants");
        const partData = await partRes.json();
        let participantsArray = [];
        if (Array.isArray(partData)) {
          participantsArray = partData;
        } else if (partData.participants && Array.isArray(partData.participants)) {
          participantsArray = partData.participants;
        } else if (partData.data && Array.isArray(partData.data)) {
          participantsArray = partData.data;
        }
        setParticipants(participantsArray);

        // Matches
        const matchRes = await fetch("http://localhost:5000/api/matches", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!matchRes.ok) throw new Error("Failed to load matches");
        const matchData = await matchRes.json();
        let matchesArray = [];
        if (Array.isArray(matchData)) {
          matchesArray = matchData;
        } else if (matchData.matches && Array.isArray(matchData.matches)) {
          matchesArray = matchData.matches;
        } else if (matchData.data && Array.isArray(matchData.data)) {
          matchesArray = matchData.data;
        }
        setMatches(matchesArray);
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateInjury = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.participantId || !formData.injuryType || !formData.severity) {
      setError("Participant, injury type, and severity are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        participantId: formData.participantId,
        matchId: formData.matchId || null,
        injuryType: formData.injuryType,
        severity: formData.severity,
        expectedRecovery: formData.expectedRecovery || null,
        status: formData.status || "Active",
        notes: formData.notes || "",
      };

      const res = await fetch("http://localhost:5000/api/injuries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.error || responseData.message || "Failed to create injury report");
      }

      await fetchInjuries();
      setShowCreateModal(false);
      resetForm();
      setSuccess("Injury report created successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit handler
  const handleEditClick = (injury) => {
    console.log("Editing injury:", injury);
    
    let participantId = "";
    if (injury.participantId) participantId = injury.participantId;
    else if (injury.participant?.id) participantId = injury.participant.id;
    else if (injury.participant?._id) participantId = injury.participant._id;
    
    let matchId = "";
    if (injury.matchId) matchId = injury.matchId;
    else if (injury.match?.id) matchId = injury.match.id;
    else if (injury.match?._id) matchId = injury.match._id;
    
    let formattedRecovery = "";
    if (injury.expectedRecovery) {
      const date = new Date(injury.expectedRecovery);
      if (!isNaN(date.getTime())) {
        formattedRecovery = date.toISOString().split('T')[0];
      }
    }

    setEditingInjury(injury);
    setFormData({
      participantId: participantId,
      matchId: matchId,
      injuryType: injury.injuryType || "",
      severity: injury.severity || "MILD",
      expectedRecovery: formattedRecovery,
      status: injury.status || "Active",
      notes: injury.notes || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateInjury = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.participantId || !formData.injuryType || !formData.severity) {
      setError("Participant, injury type, and severity are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        participantId: formData.participantId,
        matchId: formData.matchId || null,
        injuryType: formData.injuryType,
        severity: formData.severity,
        expectedRecovery: formData.expectedRecovery || null,
        status: formData.status || "Active",
        notes: formData.notes || "",
      };

      const res = await fetch(`http://localhost:5000/api/injuries/${editingInjury.id || editingInjury._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.error || responseData.message || "Failed to update injury report");
      }

      await fetchInjuries();
      setShowEditModal(false);
      setEditingInjury(null);
      resetForm();
      setSuccess("Injury report updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete handler
  const handleDeleteClick = (injury) => {
    setDeleteConfirmation(injury);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/injuries/${deleteConfirmation.id || deleteConfirmation._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        let errorMessage = "Failed to delete injury report";
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          const errorText = await res.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      await fetchInjuries();
      setDeleteConfirmation(null);
      setSuccess("Injury report deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
      setDeleteConfirmation(null);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toUpperCase()) {
      case "MILD":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "MODERATE":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "SEVERE":
        return "bg-orange-50 text-orange-700 border border-orange-200";
      case "CRITICAL":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-red-50 text-red-700 border border-red-200";
      case "RECOVERING":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "RECOVERED":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toUpperCase()) {
      case "MILD":
        return <CheckCircle className="w-4 h-4" />;
      case "MODERATE":
        return <AlertCircle className="w-4 h-4" />;
      case "SEVERE":
        return <AlertTriangle className="w-4 h-4" />;
      case "CRITICAL":
        return <Thermometer className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const resetForm = () => {
    setFormData({
      participantId: "",
      matchId: "",
      injuryType: "",
      severity: "MILD",
      expectedRecovery: "",
      status: "Active",
      notes: "",
    });
  };

  const getPlayerName = (injury) => {
    if (injury.participant?.user?.fullName) return injury.participant.user.fullName;
    if (injury.participant?.name) return injury.participant.name;
    if (injury.playerName) return injury.playerName;
    if (injury.participant?.fullName) return injury.participant.fullName;
    return "Unknown Player";
  };

  const getPlayerEmail = (injury) => {
    if (injury.participant?.user?.email) return injury.participant.user.email;
    if (injury.participant?.email) return injury.participant.email;
    if (injury.playerEmail) return injury.playerEmail;
    return "—";
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[95vw] mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Injury Reports
          </h1>
          <p className="text-gray-600 mt-2">
            Track and manage player injuries across the league
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-600 transition-all flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Report New Injury
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Injuries</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{injuries.length}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Cases</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {injuries.filter(i => i.status === "Active").length}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Critical</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {injuries.filter(i => i.severity === "CRITICAL").length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <Thermometer className="w-6 h-6 text-red-700" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Recovered</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {injuries.filter(i => i.status === "Recovered").length}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by player name or injury type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
            >
              <option value="ALL">All Severities</option>
              <option value="MILD">Mild</option>
              <option value="MODERATE">Moderate</option>
              <option value="SEVERE">Severe</option>
              <option value="CRITICAL">Critical</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Recovering">Recovering</option>
              <option value="Recovered">Recovered</option>
            </select>
            
            <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2">
              <Filter className="w-5 h-5" />
              More Filters
            </button>
            
            <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-xl">
          <div className="flex items-center gap-3">
            <CheckCircle size={24} />
            <span className="font-medium">{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          <div className="flex items-center gap-3">
            <AlertTriangle size={24} />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-16 w-16 animate-spin text-red-600" />
        </div>
      ) : filteredInjuries.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No injury reports found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || severityFilter !== "ALL" || statusFilter !== "ALL" 
              ? "Try adjusting your filters or search term" 
              : "Click 'Report New Injury' to add the first one"}
          </p>
          {searchTerm || severityFilter !== "ALL" || statusFilter !== "ALL" ? (
            <button
              onClick={() => {
                setSearchTerm("");
                setSeverityFilter("ALL");
                setStatusFilter("ALL");
              }}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Clear all filters
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-8 py-5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('participant')}
                    >
                      <div className="flex items-center gap-2">
                        Player
                        <SortIcon columnKey="participant" />
                      </div>
                    </th>
                    <th 
                      className="px-8 py-5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('injuryType')}
                    >
                      <div className="flex items-center gap-2">
                        Injury Details
                        <SortIcon columnKey="injuryType" />
                      </div>
                    </th>
                    <th 
                      className="px-8 py-5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('severity')}
                    >
                      <div className="flex items-center gap-2 justify-center">
                        Severity
                        <SortIcon columnKey="severity" />
                      </div>
                    </th>
                    <th className="px-8 py-5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Recovery Timeline
                    </th>
                    <th 
                      className="px-8 py-5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2 justify-center">
                        Status
                        <SortIcon columnKey="status" />
                      </div>
                    </th>
                    <th className="px-8 py-5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Context
                    </th>
                    <th className="px-8 py-5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {currentItems.map((injury) => (
                    <tr
                      key={injury.id || injury._id}
                      className="hover:bg-gray-50 transition-all duration-200"
                    >
                      {/* Player Column */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm">
                            <User size={24} className="text-gray-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {getPlayerName(injury)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {getPlayerEmail(injury)}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                {injury.participant?.team?.name || "No Team"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Injury Details */}
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {injury.injuryType}
                          </div>
                          <div className="text-xs text-gray-600 line-clamp-2">
                            {injury.notes || "No additional notes"}
                          </div>
                          <div className="text-xs text-gray-400 mt-2">
                            ID: {(injury.id || injury._id).slice(0, 8)}
                          </div>
                        </div>
                      </td>

                      {/* Severity */}
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getSeverityColor(injury.severity)}`}>
                            {getSeverityIcon(injury.severity)}
                            <span className="text-sm font-semibold">{injury.severity}</span>
                          </div>
                        </div>
                      </td>

                      {/* Recovery Timeline */}
                      <td className="px-8 py-6">
                        <div className="text-center space-y-2">
                          <div className="text-sm font-medium text-gray-900">
                            {injury.expectedRecovery
                              ? new Date(injury.expectedRecovery).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              : "Not specified"}
                          </div>
                          <div className="text-xs text-gray-500">
                            Reported: {new Date(injury.reportedAt || injury.createdAt).toLocaleDateString()}
                          </div>
                          {injury.expectedRecovery && (
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
                              <div 
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                                style={{ width: '75%' }}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(injury.status)}`}>
                            <div className={`w-2 h-2 rounded-full ${
                              injury.status === "Active" ? "bg-red-500" :
                              injury.status === "Recovering" ? "bg-blue-500" :
                              "bg-emerald-500"
                            }`} />
                            <span className="text-sm font-semibold">{injury.status || "Active"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Context */}
                      <td className="px-8 py-6">
                        <div className="text-center space-y-2">
                          {injury.match ? (
                            <>
                              <div className="text-sm font-medium text-gray-900">
                                Match #{injury.matchId?.slice(0, 6) || 'N/A'}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(injury.match?.date).toLocaleDateString()}
                              </div>
                            </>
                          ) : (
                            <div className="text-sm text-gray-500">
                              Training/Other
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEditClick(injury)}
                            className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Edit injury"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(injury)}
                            className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete injury"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button className="p-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all">
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Enhanced Table Footer with Pagination */}
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Items per page and showing info */}
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{startIndex + 1}-{endIndex}</span> of{' '}
                    <span className="font-semibold">{totalItems}</span> injuries
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-gray-600">per page</span>
                  </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                  {/* First Page Button */}
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                    }`}
                  >
                    <ChevronsLeft className="w-5 h-5" />
                  </button>

                  {/* Previous Page Button */}
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium ${
                            currentPage === page
                              ? "bg-red-600 text-white shadow-sm"
                              : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  {/* Next Page Button */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Last Page Button */}
                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                    }`}
                  >
                    <ChevronsRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Jump to page */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Go to page:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        setCurrentPage(page);
                      }
                    }}
                    className="w-16 text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-600">of {totalPages}</span>
                </div>
              </div>
              
              {/* Current page info */}
              <div className="mt-4 text-center text-sm text-gray-500">
                Page <span className="font-semibold">{currentPage}</span> of{' '}
                <span className="font-semibold">{totalPages}</span>{' '}
                • Showing <span className="font-semibold">{currentItems.length}</span> injuries
                {searchTerm && (
                  <span className="ml-4">
                    • Filtered from <span className="font-semibold">{injuries.length}</span> total injuries
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick stats for current page */}
          {currentItems.length > 0 && (
            <div>
              
              
            </div>
          )}
        </>
      )}

      {/* Create Injury Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Report New Injury
                </h2>
                <p className="text-gray-600 mt-2">
                  Fill in the details below to report a new injury
                </p>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition"
              >
                <X size={28} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleCreateInjury} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Player / Participant *
                  </label>
                  <select
                    value={formData.participantId}
                    onChange={(e) =>
                      setFormData({ ...formData, participantId: e.target.value })
                    }
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                    required
                  >
                    <option value="">Select Player</option>
                    {participants.map((p) => (
                      <option key={p.id || p._id} value={p.id || p._id}>
                        {p.user?.fullName || p.name || p.fullName || "Unknown Player"} 
                        {p.team?.name ? ` (${p.team.name})` : " (No team)"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Related Match (optional)
                  </label>
                  <select
                    value={formData.matchId}
                    onChange={(e) =>
                      setFormData({ ...formData, matchId: e.target.value })
                    }
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                  >
                    <option value="">No match (training/other)</option>
                    {matches.map((m) => (
                      <option key={m.id || m._id} value={m.id || m._id}>
                        {m.homeTeam?.name || "Team A"} vs {m.awayTeam?.name || "Team B"} (
                        {new Date(m.date).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Injury Type *
                  </label>
                  <input
                    type="text"
                    value={formData.injuryType}
                    onChange={(e) =>
                      setFormData({ ...formData, injuryType: e.target.value })
                    }
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                    placeholder="e.g. Ankle sprain, Hamstring tear, Concussion"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Severity *
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) =>
                      setFormData({ ...formData, severity: e.target.value })
                    }
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                    required
                  >
                    <option value="MILD">Mild</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="SEVERE">Severe</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Expected Recovery
                  </label>
                  <input
                    type="date"
                    value={formData.expectedRecovery}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expectedRecovery: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                  >
                    <option value="Active">Active</option>
                    <option value="Recovering">Recovering</option>
                    <option value="Recovered">Recovered</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                    rows="4"
                    placeholder="Additional details, symptoms, treatment plan, medical notes..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-8 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-8 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-700 hover:to-red-600 transition font-semibold shadow-lg flex items-center gap-2"
                >
                  <AlertTriangle size={20} />
                  Report Injury
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Injury Modal */}
      {showEditModal && editingInjury && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Edit Injury Report
                </h2>
                <p className="text-gray-600 mt-2">
                  Update the injury details below
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setEditingInjury(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition"
              >
                <X size={28} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleUpdateInjury} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Player / Participant *
                  </label>
                  <select
                    value={formData.participantId}
                    onChange={(e) =>
                      setFormData({ ...formData, participantId: e.target.value })
                    }
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                    required
                  >
                    <option value="">Select Player</option>
                    {participants.map((p) => (
                      <option key={p.id || p._id} value={p.id || p._id}>
                        {p.user?.fullName || p.name || p.fullName || "Unknown Player"} 
                        {p.team?.name ? ` (${p.team.name})` : " (No team)"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Related Match (optional)
                  </label>
                  <select
                    value={formData.matchId}
                    onChange={(e) =>
                      setFormData({ ...formData, matchId: e.target.value })
                    }
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                  >
                    <option value="">No match (training/other)</option>
                    {matches.map((m) => (
                      <option key={m.id || m._id} value={m.id || m._id}>
                        {m.homeTeam?.name || "Team A"} vs {m.awayTeam?.name || "Team B"} (
                        {new Date(m.date).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Injury Type *
                  </label>
                  <input
                    type="text"
                    value={formData.injuryType}
                    onChange={(e) =>
                      setFormData({ ...formData, injuryType: e.target.value })
                    }
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                    placeholder="e.g. Ankle sprain, Hamstring tear, Concussion"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Severity *
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) =>
                      setFormData({ ...formData, severity: e.target.value })
                    }
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                    required
                  >
                    <option value="MILD">Mild</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="SEVERE">Severe</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Expected Recovery
                  </label>
                  <input
                    type="date"
                    value={formData.expectedRecovery}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expectedRecovery: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                  >
                    <option value="Active">Active</option>
                    <option value="Recovering">Recovering</option>
                    <option value="Recovered">Recovered</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                    rows="4"
                    placeholder="Additional details, symptoms, treatment plan, medical notes..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-8 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingInjury(null);
                    resetForm();
                  }}
                  className="px-8 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition font-semibold shadow-lg flex items-center gap-2"
                >
                  <Save size={20} />
                  Update Injury
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="p-8 border-b">
              <h3 className="text-2xl font-bold text-gray-900">Confirm Delete</h3>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
                  <Trash2 className="w-10 h-10 text-red-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Injury Report
                </p>
                <p className="text-gray-600">
                  Are you sure you want to delete this injury report? This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-700 hover:to-red-600 transition font-semibold flex items-center gap-2"
                >
                  <Trash2 size={20} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}